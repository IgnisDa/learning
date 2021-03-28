use assert_cmd::prelude::*;
use predicates::prelude::*;
use std::io::Write;
use std::{error::Error, process::Command};
use tempfile::NamedTempFile;

#[test]
fn file_does_not_exist() -> Result<(), Box<dyn Error>> {
    let mut cmd = Command::cargo_bin("grrs")?;
    cmd.arg("foobar").arg("file/does/not/exist");
    cmd.assert()
        .failure()
        .stderr(predicate::str::contains("No such file or directory"));

    Ok(())
}

#[test]
fn finds_content_in_files() -> Result<(), Box<dyn Error>> {
    let mut file = NamedTempFile::new()?;
    writeln!(file, "A test\nActual content\nMore content\nAnother test")?;
    let mut cmd = Command::cargo_bin("grrs")?;
    cmd.arg("test").arg(file.path());
    cmd.assert()
        .success()
        .stdout(predicate::str::contains("test\nAnother test"));
    Ok(())
}
