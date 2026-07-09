import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Code2, 
  FileText, 
  Map, 
  MessageSquare, 
  Award,
  Mail,
  LogOut,
  BookOpen,
  Layers,
  User,
  Home,
  HelpCircle,
  Download,
  Users,
  Megaphone,
  Radio,
  Gift,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Settings
} from 'lucide-react';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const mainLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Home Content', path: '/admin/home-content', icon: <Home size={18} /> },
    { name: 'Skills', path: '/admin/skills', icon: <Code2 size={18} /> },
    { name: 'Services', path: '/admin/services', icon: <Layers size={18} /> },
    { name: 'About Profile', path: '/admin/about', icon: <User size={18} /> },
    { name: 'Journey', path: '/admin/journeys', icon: <Map size={18} /> },
    { name: 'Hire Requests', path: '/admin/hire-requests', icon: <Mail size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Manage Benefits', path: '/admin/benefits', icon: <Gift size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const publishSubPages = [
    { name: 'Projects', path: '/admin/projects', icon: <Briefcase size={18} /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FileText size={18} /> },
    { name: 'Case Studies', path: '/admin/case-studies', icon: <BookOpen size={18} /> },
    { name: 'Manage Resources', path: '/admin/resources', icon: <Download size={18} /> },
  ];

  const otherSubPages = [
    { name: 'Achievements', path: '/admin/achievements', icon: <Award size={18} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare size={18} /> },
    { name: 'FAQs', path: '/admin/faqs', icon: <HelpCircle size={18} /> },
    { name: 'Announcements', path: '/admin/notifications', icon: <Megaphone size={18} /> },
    { name: 'Broadcasts', path: '/admin/broadcasts', icon: <Radio size={18} /> },
  ];

  const publishPaths = publishSubPages.map(p => p.path);
  const otherPaths = otherSubPages.map(p => p.path);
  const isPublishPathActive = publishPaths.includes(location.pathname);
  const isSubPathActive = otherPaths.includes(location.pathname);

  const [isPublishOpen, setIsPublishOpen] = useState(isPublishPathActive);
  const [isOtherOpen, setIsOtherOpen] = useState(isSubPathActive);

  // Auto-expand grouped sections if one of the sub-pages is active
  useEffect(() => {
    if (isPublishPathActive) {
      setIsPublishOpen(true);
    }
    if (isSubPathActive) {
      setIsOtherOpen(true);
    }
  }, [location.pathname, isPublishPathActive, isSubPathActive]);

  return (
    <div className="w-64 bg-bg-card border-r border-border-subtle h-screen sticky top-0 flex flex-col pt-20">
      <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {mainLinks.slice(0, 2).map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all ${
                    isActive
                      ? 'bg-accent-blue/10 text-accent-blue font-semibold border border-accent-blue/20'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Grouped Publish Section */}
          <li>
            <button
              onClick={() => setIsPublishOpen(!isPublishOpen)}
              className={`flex items-center justify-between w-full gap-2.5 px-3 py-2 rounded-xl text-[13px] cursor-pointer transition-all ${
                isPublishPathActive
                  ? 'bg-accent-blue/5 text-accent-blue font-semibold border border-accent-blue/15'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={18} />
                <span>Publish</span>
              </div>
              {isPublishOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isPublishOpen && (
              <ul className="mt-1 ml-4 pl-3 border-l border-border-subtle space-y-1">
                {publishSubPages.map((subLink) => (
                  <li key={subLink.name}>
                    <NavLink
                      to={subLink.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-all ${
                          isActive
                            ? 'text-accent-blue font-semibold bg-accent-blue/5'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                        }`
                      }
                    >
                      {subLink.icon}
                      <span>{subLink.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {mainLinks.slice(2).map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all ${
                    isActive
                      ? 'bg-accent-blue/10 text-accent-blue font-semibold border border-accent-blue/20'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Grouped Other Section */}
          <li>
            <button
              onClick={() => setIsOtherOpen(!isOtherOpen)}
              className={`flex items-center justify-between w-full gap-2.5 px-3 py-2 rounded-xl text-[13px] cursor-pointer transition-all ${
                isSubPathActive
                  ? 'bg-accent-blue/5 text-accent-blue font-semibold border border-accent-blue/15'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MoreHorizontal size={18} />
                <span>Other</span>
              </div>
              {isOtherOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isOtherOpen && (
              <ul className="mt-1 ml-4 pl-3 border-l border-border-subtle space-y-1">
                {otherSubPages.map((subLink) => (
                  <li key={subLink.name}>
                    <NavLink
                      to={subLink.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] transition-all ${
                          isActive
                            ? 'text-accent-blue font-semibold bg-accent-blue/5'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                        }`
                      }
                    >
                      {subLink.icon}
                      <span>{subLink.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-[13px] text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
