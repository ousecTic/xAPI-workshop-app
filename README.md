# xAPI Workshop Project

## Overview

This project originated from a workshop conducted at the IEEE ICICLE conference. Due to the overwhelmingly positive feedback received, I've decided to make this resource freely available to the public. It serves multiple purposes:

1. As a learning tool for anyone interested in understanding xAPI (Experience API).
2. As a template for educators, trainers, and developers to conduct their own workshops on xAPI.
3. As a showcase of xAPI's capabilities in tracking and analyzing various types of learning experiences.

Whether you're a curious learner, an educator planning a workshop, or a developer exploring xAPI implementation, this project provides a practical, hands-on approach to experiencing xAPI in action.

## Live Demo

The project consists of several interconnected activities. Each activity is designed to be accessed via a QR code, encouraging participants to move around and interact with the content physically. This setup mimics a workshop environment, but you can also explore these activities directly through your browser.

### Activity Links:

- [Emoji Before Activity](http://xapi-workshop.netlify.app/emoji-before)
- [Simple Quiz](https://xapi-workshop.netlify.app/quiz)
- [Video Quiz](https://xapi-workshop.netlify.app/video)
- [Chatbox](https://xapi-workshop.netlify.app/chatbox)
- [Networking](https://xapi-workshop.netlify.app/networking)
- [Emoji After Activity](https://xapi-workshop.netlify.app/emoji-after)
- [Analytics Page](https://xapi-workshop.netlify.app/analytics)

Feel free to use and adapt these activities for your own workshops or learning experiences.

## Getting Started

To run this project locally, follow these steps:

1. **Set up SCORM Cloud Account**
   - Create an account on [SCORM Cloud](https://cloud.scorm.com/)
   - Navigate to the xAPI LRS tab > LRS endpoints

2. **Choose Endpoint**
   - For development: Use the "SCORM Cloud (sandbox)" endpoint URL
   - For production: Use the regular "SCORM Cloud" endpoint URL
  
![Screenshot 2024-07-24 075545](https://github.com/user-attachments/assets/534563f6-4426-4afa-a235-a03d1d859197)

3. **Generate Secret Key**
   - Go to Activity Providers
   - Click "Add Activity Provider"
   - Configure the following settings:
     - Authentication Type: Basic Auth
     - Active: Active
     - Allowed Endpoint: All
     - Permissions Level: Read/Write
    
![Screenshot 2024-07-24 080447](https://github.com/user-attachments/assets/487653d2-bacb-4f61-aa73-9e9570fdbc82)

4. **Configure Environment Variables**
   - Create a `.env.local` file in the project root
   - Use `.env.example` as a reference
   - Add your endpoint URL, key, and secret

5. **Install Dependencies**
   ```
   npm install
   ```

6. **Run the Project**
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to all participants of the IEEE ICICLE conference workshop for their valuable feedback and encouragement.
