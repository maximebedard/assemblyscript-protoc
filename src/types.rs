
use protobuf::descriptor::{
  EnumDescriptorProto,
  DescriptorProto,
  FileDescriptorProto,
  OneofDescriptorProto,
  FieldDescriptorProto,
  FieldDescriptorProto_Type,
  FieldDescriptorProto_Label,
};

use std::slice::Iter;
use std::collections::HashMap;

pub struct AssemblyscriptField {
  name: String,
  t: AssemblyscriptType,
}

impl AssemblyscriptField {
  pub fn name(&self) -> &str {
    self.name.as_str()
  }

  pub fn get_type(&self) -> &AssemblyscriptType {
    &self.t
  }

  // fn has_default_value(&self) -> bool {
  //   false
  // }
}

pub struct AssemblyscriptUdt {
  name: String,
  fields: Vec<AssemblyscriptField>,
}

impl AssemblyscriptUdt {
  pub fn name(&self) -> &str {
    self.name.as_str()
  }

  pub fn fields(&self) -> Iter<AssemblyscriptField> {
    self.fields.iter()
  }
}

impl From<&DescriptorProto> for AssemblyscriptUdt {
  fn from(d: &DescriptorProto) -> Self {
    let name = d.get_name().into();
    let fields = d.get_field()
      .iter()
      .map(|f| AssemblyscriptField { name: f.get_name().to_string(), t: AssemblyscriptType::new(f, d), })
      .collect::<Vec<AssemblyscriptField>>();

    Self { name, fields }
  }
}

pub struct AssemblyscriptEnum {
  name: String,
  values: Vec<(String, i32)>,
}

impl From<&EnumDescriptorProto> for AssemblyscriptEnum {
  fn from(d: &EnumDescriptorProto) -> Self {
    let name = d.get_name().into();
    let values = d.get_value()
      .iter()
      .map(|et| (et.get_name().to_string(), et.get_number()))
      .collect::<Vec<(String, i32)>>();

    Self { name, values }
  }
}

pub enum AssemblyscriptType {
  I32,
  U32,
  I64,
  U64,
  F32,
  F64,
  Boolean,
  String,
  Map { key_type: Box<Self>, value_type: Box<Self> },
  Array { value_type: Box<Self> },
  Udt { inner: AssemblyscriptUdt },
  Enum { inner: AssemblyscriptEnum },
  Optional { value_type: Box<Self> },
  Ref { name: String, },
}

impl AssemblyscriptType {
  fn new(f: &FieldDescriptorProto, d: &DescriptorProto) -> Self {
    let t = match f.get_field_type() {
      FieldDescriptorProto_Type::TYPE_FLOAT => AssemblyscriptType::F32,
      FieldDescriptorProto_Type::TYPE_DOUBLE => AssemblyscriptType::F64,
      FieldDescriptorProto_Type::TYPE_INT32 => AssemblyscriptType::I32,
      FieldDescriptorProto_Type::TYPE_INT64 => AssemblyscriptType::I64,
      FieldDescriptorProto_Type::TYPE_UINT32 => AssemblyscriptType::U32,
      FieldDescriptorProto_Type::TYPE_UINT64 => AssemblyscriptType::U64,
      FieldDescriptorProto_Type::TYPE_BOOL => AssemblyscriptType::Boolean,
      FieldDescriptorProto_Type::TYPE_STRING => AssemblyscriptType::String,

      FieldDescriptorProto_Type::TYPE_FIXED32 => AssemblyscriptType::U32,
      FieldDescriptorProto_Type::TYPE_FIXED64 => AssemblyscriptType::U64,
      FieldDescriptorProto_Type::TYPE_SFIXED32 => AssemblyscriptType::I32,
      FieldDescriptorProto_Type::TYPE_SFIXED64 => AssemblyscriptType::I64,
      FieldDescriptorProto_Type::TYPE_SINT32 => AssemblyscriptType::I32,
      FieldDescriptorProto_Type::TYPE_SINT64 => AssemblyscriptType::I64,

      FieldDescriptorProto_Type::TYPE_GROUP => unimplemented!("Groups are deprecated and not supported."),
      FieldDescriptorProto_Type::TYPE_MESSAGE => {
        let local_nested_type_name = f.get_type_name()
          .rsplitn(2, '.')
          .collect::<Vec<&str>>()[0];

        // eprintln!("name = {:?} = {:?}", local_nested_type_name[0], d.get_nested_type()[0].get_name());

        // let names = d.get_nested_type()
        //   .iter()
        //   .map(|nt| nt.get_name()).collect::<Vec<&str>>();
        //   eprintln!("n = {:?}, names = {:?}",f.get_type_name(), names);

        d.get_nested_type()
          .iter()
          .map(|nt| (nt.get_name(), nt))
          .collect::<HashMap<&str, &DescriptorProto>>()
          .remove(local_nested_type_name)
          .map(|nt| {
            if nt.get_options().get_map_entry() {
              let mut nested_type_fields = nt
                .get_field()
                .iter()
                .map(|f| (f.get_name(), f))
                .collect::<HashMap<&str, &FieldDescriptorProto>>();

              // TODO: Not sure if index is always preserved... If so, we could remove a hashmap allocation.
              let key_field = nested_type_fields.remove("key")
                .expect("Map type should have a key field.");
              let value_field = nested_type_fields.remove("value")
                .expect("Map type should have a key field.");

              let key_type = Box::new(Self::new(key_field, nt));
              let value_type = Box::new(Self::new(value_field, nt));
              AssemblyscriptType::Map { key_type, value_type }
            } else {
              let inner = AssemblyscriptUdt::from(nt);
              AssemblyscriptType::Udt { inner }
            }
          })
          .unwrap_or_else(|| AssemblyscriptType::Ref { name: f.get_type_name().to_string() })
      },
      FieldDescriptorProto_Type::TYPE_ENUM => {
        let local_nested_enum_name = f.get_type_name()
          .rsplitn(2, '.')
          .collect::<Vec<&str>>()[0];

        d.get_enum_type()
          .iter()
          .map(|et| (et.get_name(), et))
          .collect::<HashMap<&str, &EnumDescriptorProto>>()
          .remove(local_nested_enum_name)
          .map(|ne| {
            let inner = AssemblyscriptEnum::from(ne);
            AssemblyscriptType::Enum { inner }
          })
          .unwrap_or_else(|| AssemblyscriptType::Ref { name: f.get_type_name().to_string() })
      },
      FieldDescriptorProto_Type::TYPE_BYTES => AssemblyscriptType::Boolean,
    };

    match f.get_label() {
      FieldDescriptorProto_Label::LABEL_OPTIONAL => AssemblyscriptType::Optional { value_type: Box::new(t) },
      FieldDescriptorProto_Label::LABEL_REPEATED => {
        if t.is_map() {
          t
        } else {
          AssemblyscriptType::Array { value_type: Box::new(t) }
        }
      },
      FieldDescriptorProto_Label::LABEL_REQUIRED => t,
    }
  }

  fn is_map(&self) -> bool {
    match self {
      AssemblyscriptType::Map { .. } => true,
      _ => false,
    }
  }
}

impl std::fmt::Display for AssemblyscriptType {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    match self {
      AssemblyscriptType::I32 => write!(f, "i32"),
      AssemblyscriptType::U32 => write!(f, "u32"),
      AssemblyscriptType::I64 => write!(f, "i64"),
      AssemblyscriptType::U64 => write!(f, "u64"),
      AssemblyscriptType::F32 => write!(f, "f32"),
      AssemblyscriptType::F64 => write!(f, "f64"),
      AssemblyscriptType::Boolean => write!(f, "bool"),
      AssemblyscriptType::String => write!(f, "string"),
      AssemblyscriptType::Map { key_type, value_type } => write!(f, "Map<{}, {}>", key_type, value_type),
      AssemblyscriptType::Array { value_type } => write!(f, "Array<{}>", value_type),
      AssemblyscriptType::Udt { inner } => write!(f, "{}", inner.name),
      AssemblyscriptType::Enum { inner } => write!(f, "{}", inner.name),
      AssemblyscriptType::Optional { value_type } => write!(f, "{} | null", value_type),
      AssemblyscriptType::Ref { name } => write!(f, "{}", name),
    }
  }
}
