use std::io::{self, Write};

use crate::plugin::{
  CodeGeneratorRequest,
  CodeGeneratorResponse,
  CodeGeneratorResponse_File,
};

use crate::types::{
  AssemblyscriptUdt,
  AssemblyscriptEnum,
};

pub fn generate(request: CodeGeneratorRequest) -> CodeGeneratorResponse {
  let mut buffer = Vec::new();

  let mut process = || {
    for i in request.get_proto_file() {
      for j in i.get_enum_type() {
        write_enum_type(&mut buffer, j)?;
      }

      for j in i.get_message_type() {
        write_message_type(&mut buffer, j)?;
      }
    }
    Ok::<(), io::Error>(())
  };


  let mut response = CodeGeneratorResponse::new();

  match process() {
    Ok(_) => {
      let mut file = CodeGeneratorResponse_File::new();
      file.set_name("toto.pb.ts".into());
      file.set_content(String::from_utf8(buffer).expect("failed to convert buffer into utf8 string"));

      response.mut_file().push(file);
    }
    Err(_) => {
      response.set_error("boom!".into());
    }
  }

  response
}

fn write_enum_type<T: Into<AssemblyscriptEnum>>(w: &mut dyn Write, t: T) -> io::Result<()> {
  let enum_type = t.into();
  // writeln!(w, "enum {} {{", enum_type.get_name())?;
  // for v in enum_type.get_value() {
  //   writeln!(w, "  {} = {}", v.get_name(), v.get_number())?;
  // }
  // writeln!(w, "}}")?;
  Ok(())
}



fn write_message_type<T: Into<AssemblyscriptUdt>>(w: &mut dyn Write, t: T) -> io::Result<()> {
  let udt = t.into();
  writeln!(w, "class {} {{", udt.name())?;

  for f in udt.fields() {
    writeln!(w, "  private {}: {};", f.name(), f.get_type())?;
  }
  writeln!(w, "")?;

  // let fields_with_default_value = udt.fields()
  //   .filter(|f| f.has_default_value())
  //   .collect::<Vec<&AssemblyscriptField>>();

  // if fields_with_default_value.len() > 0 {
  //   writeln!(w, "  constructor() {{")?;
  //   for f in fields_with_default_value {
  //     writeln!(w, "  this.{} = {};", f.name(), f.)
  //   }
  //   writeln!(w, "  }}")?;
  // }

  for f in udt.fields() {
    writeln!(w, "  get{}(): {} {{ return this.{}; }}", f.name(), f.get_type(), f.name())?;
    writeln!(w, "  set{}(v: {}) {{ this.{} = v; }}", f.name(), f.get_type(), f.name())?;
    writeln!(w, "")?;
  }

  writeln!(w, "}}")?;
  writeln!(w, "")?;

  // for nt in t.get_nested_type() {
  //   writeln!(w, "namespace {} {{", t.get_name())?;
  //   write_message_type(w, nt)?;
  //   writeln!(w, "}}")?;
  //   writeln!(w, "")?;
  // }
  Ok(())
}

