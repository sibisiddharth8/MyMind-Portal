# **MyMind | Portal** 🚀

Welcome to **MyMind | Portal** 🎨, your one-stop solution for dynamically managing and updating the **Bio**, **Skills**, **Experience**, **Projects**, and **Education** sections of your personal portfolio. Designed with **simplicity** and **efficiency** in mind, this portal lets you keep your portfolio content fresh and up to date.

🔗 Access the portal here: [MyMind | Portal](https://sibisiddharth8.github.io/MyMind-Portal/)

🌐 Check out the live portfolio: [MyMind | Portfolio](https://sibisiddharth8.github.io/portfolio-react/)

## **Key Features** ✨

### 1. **Google Authentication** 🔒
- **Secure** login via Google Authentication.
- The login page includes:
  - **Heading:** MyMind | Portal
  - **Inputs:** Email and Password (with a show/hide toggle 👁️)
  - **Login Button** to proceed to the portal.

  **Desktop View:**

  <img src="./Readme-images/Desktop/login Page Sibi Siddharth S MyMind Portal.png" alt="Login Page - Desktop" width="100%" />


  **Mobile View:**

  <img src="./Readme-images/Mobile/Login Page.jpeg" alt="Login Page - Mobile" width="30%" />
  
### 2. **Customizable Pages** 🛠️
Upon logging in, you are greeted with a **Welcome Message** 🎉 and given options to manage the following pages:

#### **Bio** 📝
- Edit and save your:
  - **Name** ✍️
  - **Description** 🗒️
  - **Roles** 💼
  - **Profile Picture** 📸
  - **GitHub URL** 🔗
  - **LinkedIn URL** 🔗
  - **Instagram URL** 📷
  - **Resume** (with upload functionality 📄)
- Delete all bio data with the **Delete Button** 🗑️.

  **Desktop View:**

<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Desktop//Bio Page/Bio Page-1 Sibi Siddharth S MyMind Portal.png" alt="Bio Page - Desktop" width="100%" /></td>
    <td>
  </tr>
</table>
<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Desktop//Bio Page/Bio Page-2 Sibi Siddharth S MyMind Portal.png" alt="Bio Page - Desktop" width="100%" /></td>
    <td>
  </tr>
</table>


  **Mobile View:**

<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Mobile/Bio Page//Bio Page -1.jpeg" alt="Bio Page - Mobile" width="100%" /></td>
    <td><img src="./Readme-images/Mobile/Bio Page//Bio Page -2.jpeg" alt="Bio Page - Mobile" width="100%" /></td>
    <td><img src="./Readme-images/Mobile/Modals/Success Modal.jpeg" alt="Success Modal - Mobile" width="100%" /></td>
  </tr>
</table>

#### **Skills** 🛠️
- Add, edit, or delete skills.
- Inputs include:
  - **Skill Name** 💡
  - **Skill Type** (Frontend, Backend, AI/ML, Others) 🖥️
  - **Upload Skill Image** 🖼️

  **Desktop View:**

<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Desktop/Skills Page/Skills Page-1 Sibi Siddharth S MyMind Portal.png" alt="Skills Page - Desktop" width="100%" /></td>
    <td>
  </tr>
</table>
<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Desktop/Skills Page/Skills Page-2 Sibi Siddharth S MyMind Portal.png" alt="Skills Page - Desktop" width="100%" /></td>
    <td>
  </tr>
</table>


  **Mobile View:**

<table style="width: 100%; text-align: center;">
  <tr>
    <td><img src="./Readme-images/Mobile/Skills Page/Skills Page-0.jpeg" alt="Skills Page - Mobile" width="100%" /></td>
    <td><img src="./Readme-images/Mobile/Skills Page/Skills Page-1.jpeg" alt="Skills Page - Mobile" width="100%" /></td>
    <td><img src="./Readme-images/Mobile/Skills Page/Skills Page-2.jpeg" alt="Skills Modal - Mobile" width="100%" /></td>
  </tr>
</table>

#### **Experience** 💼
- Add, edit, or delete experiences.
- Experience is displayed as cards 🃏 with **Edit** and **Delete** options.
- Input fields include:
  - **Company Name** 🏢
  - **Date** 📅
  - **Role** 👔
  - **Description** 📝
  - **Company Link** 🔗
  - **Skills Gained** 💡
  - **Company Logo** 🏙️

#### **Projects** 💻
- Manage projects with options to **add**, **edit**, or **delete**.
- Projects are displayed as cards 🃏 with:
  - **Title** 🏷️
  - **Category** (Web, Deep Learning, Machine Learning, etc.) 📂
  - **Date** 📅
  - **Description** 📝
  - **GitHub URL** 🔗
  - **Web App URL** 🌐
  - **Tags** 🏷️
  - **Project Image** 🖼️
  - **Team Members** 👥 (add/delete team members with inputs for their name, GitHub URL, LinkedIn URL, profile picture)
  - **Checkbox** to "Show Project on Home Page" 🏠 of the portfolio.

#### **Education** 🎓
- Manage education with options to **add**, **edit**, or **delete**.
- Displayed as cards 🃏 with edit and delete features.
- Input fields include:
  - **School/College Name** 🏫
  - **Degree** 🎓
  - **Date** 📅
  - **Grade** 📊
  - **Description** 📝
  - **School/College Logo** 🏫

### 3. **Portal Page** 🏠
After login, navigate the portal using:
- **Five Buttons** 🔘 leading to the respective pages (Bio, Skills, Experience, Projects, Education)
- **Logout Button** 🚪 to securely log out.

### 4. **Reusable Components** 🔁
- **Header** 🔝: Includes navigation back to the portal.
- **Footer** 🔻: Includes the MyMind | Portfolio logo, your name, and social icons for **GitHub**, **LinkedIn**, and **Instagram**, along with a copyright message.

### 5. **Modals and Loaders** ⏳
- **Confirmation modals** 🛑 to prevent accidental deletions.
- **Loaders** ⏳ for a smooth user experience during data and image uploads.

### 6. **Responsive Design** 📱💻
- The entire portal is optimized for both desktop and mobile use, providing a seamless experience across devices.

### 7. **PWA Support** 📲
- The portal can be installed as a web app with a custom icon via the `manifest.json`.
- Includes **meta tags**, **Open Graph (OG) tags**, and **Twitter tags** 🐦 for SEO optimization and social media integration.

## **Tech Stack** 🛠️
- **Frontend**: React.js, Tailwind CSS 🎨
- **Hosting**: GitHub Pages 🖥️
- **Backend**: Firebase (Realtime Database for data, Storage for images, and Authentication for login) 🔥
- **Authentication**: Google Sign-In 🔒

## **Collaboration** 🤝
We are open to contributions! If you're interested in collaborating or enhancing this project, feel free to **fork** this repository 🍴 and submit a **pull request** 🔄. Let's build something great together!

---


