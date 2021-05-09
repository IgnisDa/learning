use chrono::{datetime::DateTime, UTC};
use uuid::Uuid;

#[derive(Debug, Clone, RustcEncodable, RustcDecodable)]
pub struct Post {
    title: String,
    body: String,
    author: String,
    date_time: DateTime<UTC>,
    uuid: Uuid,
}

impl Post {
    pub fn new(
        title: &str,
        body: &str,
        author: &str,
        date_time: DateTime<UTC>,
        uuid: Uuid,
    ) -> Self {
        Self {
            title: title.to_string(),
            body: body.to_string(),
            author: author.to_string(),
            date_time,
            uuid,
        }
    }

    pub fn uuid(&self) -> &Uuid {
        &self.uuid
    }
}
