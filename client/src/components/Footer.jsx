import { MapPin, Globe, MessageCircle, Share2, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">CivGo</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Empowering citizens to report, track, and resolve civic issues efficiently for a better community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors"><Share2 className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/submit-complaint" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Report an Issue</Link></li>
              <li><Link to="/history" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Track Status</Link></li>
              <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Departments</Link></li>
              <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</Link></li>
              <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-500" /> 1800-123-4567</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-500" /> support@CivGo.com</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" /> 123 Civic Center Drive,<br />Metropolis, NY 10001</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} CivGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
