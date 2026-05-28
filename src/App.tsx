import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Prompts } from "./pages/Prompts";
import { Tools } from "./pages/Tools";
import { PromptMaker } from "./pages/PromptMaker";
import { ImageEditor } from "./pages/ImageEditor";
import { GPT } from "./pages/GPT";
import { Designs } from "./pages/Designs";
import { Blog } from "./pages/Blog";
import { Categories } from "./pages/Categories";
import { About } from "./pages/About";
import { Templates } from "./pages/Templates";
import { Dashboard } from "./pages/Admin/Dashboard";
import { AdminLogin } from "./pages/Admin/Login";
import { ManageProjects } from "./pages/Admin/ManageProjects";
import { ManagePrompts } from "./pages/Admin/ManagePrompts";
import { ManageCategories } from "./pages/Admin/ManageCategories";
import { ManageApps } from "./pages/Admin/ManageApps";
import { ManageTools } from "./pages/Admin/ManageTools";
import { ManageDesigns } from "./pages/Admin/ManageDesigns";
import { ManageSettings } from "./pages/Admin/ManageSettings";
import { ManageBlog } from "./pages/Admin/ManageBlog";
import { ManageMedia } from "./pages/Admin/ManageMedia";

import { Analytics } from "./pages/Admin/Analytics";
import { HomepageSettings } from "./pages/Admin/HomepageSettings";
import { HeroSettings } from "./pages/Admin/HeroSettings";
import { AdsManager } from "./pages/Admin/AdsManager";
import { SeoSettings } from "./pages/Admin/SeoSettings";
import { NavbarSettings } from "./pages/Admin/NavbarSettings";
import { FooterSettings } from "./pages/Admin/FooterSettings";
import { AppearanceSettings } from "./pages/Admin/AppearanceSettings";

import { SettingsProvider } from "./lib/SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="prompt-maker" element={<PromptMaker />} />
            <Route path="image-editor" element={<ImageEditor />} />
            <Route path="gpt" element={<GPT />} />
            <Route path="tools" element={<Tools />} />
            <Route path="designs" element={<Designs />} />
            <Route path="blog" element={<Blog />} />
            <Route path="categories" element={<Categories />} />
            <Route path="about" element={<About />} />
            <Route path="templates" element={<Templates />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="prompts" element={<ManagePrompts />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="tools" element={<ManageTools />} />
            <Route path="apps" element={<ManageApps />} />
            <Route path="designs" element={<ManageDesigns />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="media" element={<ManageMedia />} />
            <Route path="homepage" element={<HomepageSettings />} />
            <Route path="hero" element={<HeroSettings />} />
            <Route path="ads" element={<AdsManager />} />
            <Route path="seo" element={<SeoSettings />} />
            <Route path="navbar" element={<NavbarSettings />} />
            <Route path="footer" element={<FooterSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="*" element={<div className="text-white/50 p-8 glass-card rounded-3xl text-center">Page Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}
