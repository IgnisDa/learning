use anyhow::{Context, Result};
use std::{fs::read_to_string, io::stdout, path::PathBuf};
use structopt::StructOpt;

mod lib;

fn main() -> Result<()> {
    // we parse the command line arguments that we got into a struct
    let args = Cli::from_args();
    // we open the file which we got and read it into a string, and exit if the file does
    // not exist
    let content = read_to_string(&args.path)
        .with_context(|| format!("Could not read from file: `{}`", args.path.display()))?;
    // we iterate over the contents of the file
    grrs::find_matches(&content, &args.pattern, &mut stdout());
    Ok(())
}

#[cfg(test)]
mod test {

    #[test]
    fn find_a_match() {
        let mut result = Vec::new();
        grrs::find_matches("lorem ipsum\ndolor sit yay", "lorem", &mut result);
        assert_eq!(result, b"lorem ipsum\n");
    }
}

// search for a line in a file and display the line that contains it
#[derive(StructOpt, Debug)]
struct Cli {
    // the pattern to look fir
    pattern: String,
    // the path of the file to read from
    #[structopt(parse(from_os_str))]
    path: PathBuf,
}
