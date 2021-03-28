use std::io::Write;

pub fn find_matches(content: &str, pattern: &str, mut writer: impl Write) {
    for line in content.lines() {
        if line.contains(pattern) {
            match writeln!(writer, "{}", line) {
                Ok(_) => {}
                Err(e) => {
                    println!("Could not handle buffer errors: `{}`", e);
                }
            };
        }
    }
}
