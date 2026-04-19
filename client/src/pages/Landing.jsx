import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Camera, Bell, CheckCircle, Users, Building, Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
              Smart City Initiative
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              Report Civic <br className="hidden lg:block"/>
              <span className="text-blue-600">
                Problems Easily
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Submit complaints digitally, attach photos, and track resolution in real-time. Join thousands of citizens making our city better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/submit-complaint" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
                Raise Complaint <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/history" className="btn-secondary text-lg px-8 py-3">
                Track Complaint
              </Link>
            </div>
          </div>

          <div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 relative bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="City landscape" 
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Registered Citizens', value: '50k+', icon: Users, color: 'text-blue-500' },
          { label: 'Issues Resolved', value: '12k+', icon: CheckCircle, color: 'text-green-500' },
          { label: 'Departments', value: '15+', icon: Building, color: 'text-indigo-500' },
          { label: 'Active Reports', value: '342', icon: Activity, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-4">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A simple, transparent process to get your civic issues resolved quickly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: '1', 
              title: 'Spot & Report', 
              desc: 'Take a photo, add location details, and submit your complaint.',
              icon: Camera
            },
            { 
              step: '2', 
              title: 'Assign & Action', 
              desc: 'The right department is automatically notified to take action.',
              icon: Bell
            },
            { 
              step: '3', 
              title: 'Track & Resolve', 
              desc: 'Get real-time updates until your issue is completely resolved.',
              icon: CheckCircle
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-8 text-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-4 border-white dark:border-gray-900">
                {item.step}
              </div>
              <div className="mt-6 mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
