use std::{env, error::Error, fs};

pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.filename)?;
    let results = if config.case_sensitive {
        search(&config.query, &contents)
    } else {
        search_case_insensitive(&config.query, &contents)
    };
    for line in results {
        println!("{}", line);
    }
    Ok(())
}
/// # Config
/// This is the default structure that will hold the configuration of the command executed
/// by the user.
///
/// # Examples:
/// let a = 5;
/// assert_eq!(5, a);
pub struct Config {
    pub query: String,
    pub filename: String,
    pub case_sensitive: bool,
}

impl Config {
    pub fn new(mut args: env::Args) -> Result<Self, &'static str> {
        args.next();
        let query = match args.next() {
            Some(arg) => arg,
            None => return Err("Did not get a query string"),
        };
        let filename = match args.next() {
            Some(arg) => arg,
            None => return Err("Did not get a filename"),
        };
        let case_sensitive_flag = match args.next() {
            Some(_) => true,
            None => false,
        };
        let case_sensitive_flag = if case_sensitive_flag { false } else { true };

        let mut case_sensitive = env::var("CASE_INSENSITIVE").is_err();
        if !case_sensitive_flag {
            case_sensitive = false
        };

        Ok(Config {
            query,
            filename,
            case_sensitive,
        })
    }
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|line| line.contains(query))
        .collect()
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    contents
        .lines()
        .filter(|line| line.to_lowercase().contains(&query))
        .collect()
}

mod test;
