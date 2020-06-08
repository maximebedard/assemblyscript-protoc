#[cfg(test)]
mod tests {
  use std::process::Command;

  #[test]
  fn test_kitchen_sink() {
    // protoc --plugin=protoc-gen-assemblyscript=./target/debug/assemblyscript-protoc --assemblyscript_out=./tests/out ./tests/kitchen-sink.proto
    let output = Command::new("protoc")
      .arg(format!("--plugin=protoc-gen-assemblyscript={}", env!("CARGO_BIN_EXE_assemblyscript-protoc")))
      .arg("--assemblyscript_out=tests/kitchen-sink/assembly/proto")
      .arg("tests/kitchen-sink.proto")
      .output()
      .expect("Failed to execute command.");

    if !output.status.success() {
      panic!("Failed to generate schema: {}", String::from_utf8(output.stderr).unwrap())
    }

    let output = Command::new("npm")
      .current_dir("tests/kitchen-sink")
      .arg("run")
      .arg("asbuild")
      .output()
      .expect("Failed to execute command.");

    if !output.status.success() {
      panic!("Failed to build kitchen-sink project: {}", String::from_utf8(output.stderr).unwrap())
    }
  }
}
