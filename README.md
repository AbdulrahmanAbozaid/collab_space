# CollabSpace

## Introduction

**CollabSpace** is a real-time collaborative platform that integrates document editing, voice calls, and peer-to-peer communication. It's built using modern web technologies like WebRTC, Socket.io, Yjs, and Quill.js to provide seamless real-time collaboration for users.

- **Deployed Site**: Not Yet
- **Blog Article**: Not Yet
- **Author(s)**: [Abdulrahman Abuzied - LinkedIn](https://www.linkedin.com/in/abdulrahman-abuzeid-a5a347231/)

## Screenshot

![CollabSpace Screenshot](https://drive.google.com/file/d/1swRHIEVdcD8oJ7N7yOjl9qQKgvG8rRMp/view?usp=sharing)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdulrahmanAbozaid/collab_space
   ```
2. Navigate to the project directory:
   ```bash
   cd collabspace
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   DATABASE_URL=your_database_url
   SOCKET_IO_SERVER=your_socket_io_server
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

- **Real-time Editing**: Users can create and join rooms for collaborative editing with Quill.js and Yjs. Changes are synced across peers in real time.
- **Real-time Communication**: The platform supports WebRTC-based voice calls for seamless team communication during editing sessions.
- **Peer-to-Peer**: WebRTC is used for peer-to-peer connection and communication, minimizing latency.

## Contributing

Contributions are welcome! If you'd like to help improve the project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

## Related Projects

- [PeerJS](https://peerjs.com/)
- [Yjs](https://yjs.dev/)
- [Quill.js](https://quilljs.com/)
- [Agora WebRTC SDK](https://www.agora.io/en/products/webrtc/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
