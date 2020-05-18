mod plugin;
mod types;
mod generator;

use protobuf::{parse_from_reader, Message};

fn main() {
  let request = parse_from_reader::<plugin::CodeGeneratorRequest>(&mut std::io::stdin())
    .expect("failed to parse CodeGeneratorRequest from stdin.");

  let response = generator::generate(request);

  response.write_to_writer(&mut std::io::stdout())
    .expect("failed to write CodeGeneratorResponse to stdout.");
}

