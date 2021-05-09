use database::Database;
use handlers::{Handlers, JsonAfterMiddleware, LoggingMiddleware};
use models::Post;
use router::Router;
use uuid::Uuid;

use iron::prelude::Chain;
use iron::Iron;
mod database;
mod handlers;
mod models;

fn main() {
    let mut db = Database::new();
    let p1 = Post::new(
        "The first post",
        "This is the first post in the API",
        "Jane Doe",
        chrono::offset::utc::UTC::now(),
        Uuid::new_v4(),
    );
    db.add_post(p1);
    let p2 = Post::new(
        "The second post",
        "This is the second post in the API, which happens to be better than the first one",
        "Annabeth Chase",
        chrono::offset::utc::UTC::now(),
        Uuid::new_v4(),
    );
    db.add_post(p2);

    let handlers = Handlers::new(db);
    let json_content_middleware = JsonAfterMiddleware;
    let logging_middleware = LoggingMiddleware;

    let mut router = Router::new();
    router.get("/post-feed", handlers.post_feed, "post_feed");
    router.post("/post", handlers.post_post, "post_post");
    router.get("/post/:id", handlers.post, "post");

    let mut chain = Chain::new(router);
    chain.link_before(logging_middleware);
    chain.link_after(json_content_middleware);
    // chain.link_after(logger_after);

    Iron::new(chain).http("localhost:8000").unwrap();
}
