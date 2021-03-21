use std::{
    io::{self, ErrorKind, Read, Write},
    sync::mpsc::{channel, TryRecvError},
    thread,
    time::Duration,
};
use std::{net::TcpStream, thread::spawn};

const LOCAL: &str = "127.0.0.1:8000";
const MESSAGE_SIZE: usize = 32;

fn main() {
    let mut client = TcpStream::connect(LOCAL).expect("Stream failed to connect");
    client
        .set_nonblocking(true)
        .expect("Failed to initialize non-blocking...");

    let (tx, rx) = channel::<String>();
    spawn(move || loop {
        let mut buff = vec![0; MESSAGE_SIZE];
        match client.read_exact(&mut buff) {
            Ok(_) => {
                let msg = buff.into_iter().take_while(|&x| x != 0).collect::<Vec<_>>();
                println!("Message received: {:?}", msg);
            }
            Err(ref error) if error.kind() == ErrorKind::WouldBlock => (),
            Err(_) => {
                println!("The connection was closed");
                break;
            }
        }
        match rx.try_recv() {
            Ok(msg) => {
                let mut buff = msg.clone().into_bytes();
                buff.resize(MESSAGE_SIZE, 0);
                client.write_all(&buff).expect("Writing to socket failed");
                println!("Message sent: {:?}", msg);
            }
            Err(TryRecvError::Empty) => (),
            Err(TryRecvError::Disconnected) => break,
        };
        thread::sleep(Duration::from_millis(10))
    });

    println!("Write a message:");
    loop {
        let mut buff = String::new();
        io::stdin()
            .read_line(&mut buff)
            .expect("Reading from stdin failed");
        let msg = buff.trim().to_string();
        if msg == ":quit" || tx.send(msg).is_err() {
            break;
        }
    }
    println!("Bye Bye!");
}
