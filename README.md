# M-care - Your Sexual Health Provider

### Description

M-care is a comprehensive appointment booking system designed for sexual health services. It streamlines the entire process, from service selection and scheduling to secure payment verification and automated email confirmation. The application ensures a seamless and reliable user experience by integrating robust features like QR code-based payment processing and asynchronous job handling via a message queue.

### Demo

**Live Demo:** [https://m-care.onrender.com/](https://m-care.onrender.com/)

---

### Features

- **Service Selection:** Users can browse and select from a list of available sexual health services.
- **Appointment Scheduling:** A user-friendly calendar allows users to choose a convenient date and time slot. Time slots for past hours are automatically disabled.
- **PromptPay QR Code Generation:** The system dynamically generates a unique QR code with the total amount for the selected services, facilitating easy and accurate payments.
- **Payment Slip Verification:** Users can submit their payment slip. The system validates the slip by:
    - Extracting and decoding the payment reference string from the QR code.
    - Checking for duplicate submissions of previously verified slips.
    - Validating the payment amount and recipient details against an external API.
- **Asynchronous Processing:**
    - **RabbitMQ Queue (Verification):** A dedicated queue and worker are used for asynchronous slip verification, preventing UI blocking and ensuring a smooth user experience.
    - **RabbitMQ Queue (Email):** Upon successful verification, a separate queue triggers an email worker to send a confirmation email to the user.
- **Email Confirmation:** Users receive an automated email confirming their appointment details after a successful payment verification.

---

### Tech Stack

- **Frontend:**
    - Next.js
    - Tailwind CSS
- **Backend:**
    - Node.js
    - Express.js
    - PromptPay API
    - OpenVerify API
    - MongoDB
- **Tools:**
    - Event Driven Architecture (RabbitMQ)
    - Node.js
    - Express.js
    - PromptPayAPI
    - OpenVerifyAPI
    - MongoDB
    - Postman

---

### How It Works

1.  **User Flow:**
    - A user selects a service and fills in their information.
    - They choose an available time slot. Past time slots are automatically disabled.
    - The system generates a **PromptPay QR code** for payment.
2.  **Payment and Verification:**
    - The user pays and uploads their payment slip.
    - The frontend extracts the QR code information from the slip and sends it to the backend.
    - A **RabbitMQ queue (`verification_queue`)** receives the verification request.
    - The **Verification Worker** processes the request:
        - It decodes the QR string to get a unique transaction reference.
        - It checks the database to ensure the transaction reference has not been previously verified.
        - It calls the **Open Slip API** with the decoded string and the expected amount.
        - It validates the recipient name returned by the API against the expected recipient from the `.env` file.
3.  **Completion:**
    - If all checks pass, the slip is marked as verified in the system.
    - A new message is sent to another **RabbitMQ queue (`email_queue`)**.
    - The **Email Worker** processes this message and sends a confirmation email to the user.

---

### Local Development (Work in Progress - Open API is Local Only)

To run this project locally, you will need to:

1.  Clone the repository:
    ```bash
    git clone [repository_url]
    cd M-care
    ```
2.  Install dependencies for both frontend and backend:
    ```bash
    # Install frontend dependencies
    cd frontend
    npm install
    
    # Install backend dependencies
    cd ../backend
    npm install
    ```
3.  Set up environment variables. Create a `.env` file in the backend directory and configure the following:
    - MongoDB connection string.
    - RabbitMQ connection URL.
    - Recipient name for payment verification.
    - Other necessary API keys or credentials.
4.  Start the backend and frontend servers:
    ```bash
    # Start the backend server
    cd backend
    npm run dev
    
    # Start the frontend server (in a separate terminal)
    cd ../frontend
    npm run dev
    ```

**Note:** The Open Slip API is configured to only accept requests from a local machine in the current deployment demonstration.
