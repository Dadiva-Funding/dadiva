# Dádiva Grants

A quadratic funding platform for projects in Brazil.

![Dádiva](https://github.com/user-attachments/assets/6c69f570-e762-4186-bb2d-4b951a88aee4)


---

## 🔍 About the Project

Dádiva Grants is an adapted fork of [SimpleGrants](https://github.com/supermodularxyz/simplegrants) enabling the creation of quadratic funding rounds for Brazilian projects with native integration to the PIX payment system.

---

## 💻 Technical Stack

| Layer | Technologies |
|--------|-------------|
| 🎨 **Frontend** | Next.js + Tailwind CSS |
| ⚙️ **Backend** | Next.js API Routes |
| 🗄️ **Database** | PostgreSQL + Prisma |
| 🔐 **Authentication** | NextAuth.js |
| 💸 **Payments** | PIX Integration |

---

## 🚀 Quick Installation

```bash
# Clone the repository
git clone https://github.com/your-username/simplegrants-br.git

# Install dependencies
cd simplegrants-br
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 🛠️ Development

```sh
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 Testing

```sh
# Unit / Integration / Components (Vitest)
npm run test

# End-to-End (Playwright)
npm run test:e2e

# E2E codegen (opens browser to record actions)
npm run test:codegen
```

---

## 📲 PIX Webhooks

Simulate a successful PIX transaction (adapt according to your PIX provider)

```sh
# Example command to listen for webhook locally
pix-cli listen --forward-to localhost:3000/api/pix/webhook

# Example command to trigger a successful PIX payment (adapt to your PIX provider)
pix-cli trigger payment.succeeded
```

*(Note: Replace the commands above with the specific ones provided by your PIX integration service.)*

---

## 🎛️ Prisma Studio

Open Prisma graphical interface for database management

```sh
npm run db:studio
```

---

## 🗺️ Roadmap

### 📋 Backlog

**🌎 Interface Translation**
  - [ ] Translate UI components into Portuguese
  - [ ] Adapt texts for Brazilian context
  - [ ] Implement i18n system

**💰 PIX Integration**
  - [ ] Add PIX QR Code generation
  - [ ] Implement webhook for payments
  - [ ] Develop payment status screen
  - [ ] Configure timeout and notifications

**🇧🇷 Local Adaptations**
  - [ ] Add fields for CPF/CNPJ
  - [ ] Implement validation for Brazilian documents
  - [ ] Adapt forms to Brazilian standards

**✅ Project Verification**
  - [ ] Create simplified verification flow
  - [ ] Implement validation of documents
  - [ ] Develop approval dashboard

**📈 Enhancements from Dádiva Funding Original Repository**
  - [ ] Review features from the original Dádiva repository
  - [ ] Evaluate functionalities for potential integration
  - [ ] Integrate additional security and optimization improvements

### ⏱️ To-Do

1. [ ] Fork original Dádiva Funding repository
2. [ ] Configure development environment
3. [ ] Implement initial database schema
4. [ ] Translate main UI components
5. [ ] Initial PIX integration tests using sandbox
6. [ ] Develop core project and donation pages
7. [ ] Set up basic authentication
8. [ ] Conduct initial usability testing

---

## 👥 How to Contribute

- [Telegram](https://t.me/+x3H3GHVTFFs5MTYx)
- [Discord](https://discord.com/invite/4S8da4vgKZ)
---

<p align="center">
  <sub>to give, receive, and reciprocate to public goods projects in Brazil</sub>
</p>

