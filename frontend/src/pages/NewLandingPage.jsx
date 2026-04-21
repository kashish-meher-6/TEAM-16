import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Users, UserPlus, Eye, ArrowRight,
  ChevronRight, Menu, X, Code2, Database, Globe
} from 'lucide-react';
import axios from 'axios';

// ─── Add Member Page ──────────────────────────────────────────────────────────
function AddMemberPage({ onBack }) {
  const [form, setForm] = useState({
    name: '', roll: '', year: '', degree: '',
    aboutProject: '', hobbies: '', certificate: '',
    internship: '', aboutYourAim: '', image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.roll.trim()) e.roll = 'Roll number is required';
    if (!form.year.trim()) e.year = 'Year is required';
    if (!form.degree.trim()) e.degree = 'Degree is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm(f => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
      await axios.post('http://localhost:5000/members', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch {
      alert('Failed to add member. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-card p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Member Added!</h2>
        <p className="text-gray-500 text-sm mb-6">Team member successfully saved to the database.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => { setSuccess(false); setForm({ name:'',roll:'',year:'',degree:'',aboutProject:'',hobbies:'',certificate:'',internship:'',aboutYourAim:'',image:null }); setPreview(null); }}
            className="btn-primary text-sm px-5 py-2">Add Another</button>
          <button onClick={onBack} className="btn-secondary text-sm px-5 py-2">Back to Home</button>
        </div>
      </div>
    </div>
  );

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Priya Sharma' },
    { name: 'roll', label: 'Roll Number', type: 'text', placeholder: 'e.g. 22CS101' },
    { name: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2nd Year' },
    { name: 'degree', label: 'Degree', type: 'text', placeholder: 'e.g. B.Tech CSE' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold">
          <Shield size={18} />
          <span>CIVIC LENS</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-normal opacity-80">Team 16 · Add Member</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-600 px-6 py-5">
            <h1 className="text-white text-xl font-extrabold">Add Team Member</h1>
            <p className="text-white/70 text-sm mt-1">Fill in the details below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Photo Preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-surface flex items-center justify-center">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <Users size={32} className="text-gray-300" />}
              </div>
              <label className="cursor-pointer">
                <span className="text-sm font-semibold text-primary border border-primary/30 px-4 py-1.5 rounded-full hover:bg-primary/5 transition-colors">
                  Upload Photo
                </span>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>

            {/* Required fields */}
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ name, label, type, placeholder }) => (
                <div key={name} className={name === 'name' ? 'col-span-2' : ''}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                  <input
                    type={type} name={name} value={form[name]}
                    onChange={handleChange} placeholder={placeholder}
                    className={`input text-sm ${errors[name] ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                  {errors[name] && <p className="text-red-500 text-xs mt-0.5">{errors[name]}</p>}
                </div>
              ))}
            </div>

            {/* Optional textareas */}
            {[
              { name: 'aboutProject', label: 'About Project' },
              { name: 'aboutYourAim', label: 'About Your Aim' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                <textarea name={name} value={form[name]} onChange={handleChange} rows={3}
                  className="input text-sm resize-none" placeholder={`Write your ${label.toLowerCase()}...`} />
              </div>
            ))}

            {/* Single-line optional fields */}
            {[
              { name: 'hobbies', placeholder: 'Hobbies (comma separated)' },
              { name: 'certificate', placeholder: 'Certificate' },
              { name: 'internship', placeholder: 'Internship' },
            ].map(({ name, placeholder }) => (
              <input key={name} type="text" name={name} value={form[name]}
                onChange={handleChange} placeholder={placeholder}
                className="input text-sm" />
            ))}

            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2">
              {loading ? <span className="spinner !w-4 !h-4" /> : <><UserPlus size={16} /> Submit Member</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── View Members Page ────────────────────────────────────────────────────────
function ViewMembersPage({ onBack, onViewDetail }) {
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    axios.get('http://localhost:5000/members')
      .then(r => setMembers(r.data))
      .catch(() => setError('Could not load members. Ensure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold">
          <Shield size={18} />
          <span>CIVIC LENS</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-normal opacity-80">Team 16 · Members</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-primary text-center mb-1">MEET OUR AMAZING TEAM</h1>
        <div className="w-12 h-1 bg-primary mx-auto rounded mb-8" />

        {loading && (
          <div className="flex justify-center py-20">
            <div className="spinner !w-8 !h-8" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p>No members yet. Add some!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {members.map(member => (
            <div key={member._id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-modal transition-shadow group">
              <div className="h-40 bg-surface overflow-hidden">
                {member.image
                  ? <img src={`http://localhost:5000/${member.image}`} alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <Users size={40} className="text-gray-200" />
                    </div>
                }
              </div>
              <div className="p-4 text-center">
                <p className="font-bold text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Roll Number: {member.roll}</p>
                <button onClick={() => onViewDetail(member._id)}
                  className="mt-3 w-full bg-primary text-white text-xs font-semibold py-1.5 rounded-full hover:bg-primary-600 transition-colors uppercase tracking-wide">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Member Detail Page ───────────────────────────────────────────────────────
function MemberDetailPage({ memberId, onBack }) {
  const [member, setMember] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get(`http://localhost:5000/members/${memberId}`)
      .then(r => setMember(r.data))
      .catch(() => alert('Could not load member details.'))
      .finally(() => setLoading(false));
  }, [memberId]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold">
          <Shield size={18} />
          <span>CIVIC LENS</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-normal opacity-80">Team 16 · Member Detail</span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-32">
          <div className="spinner !w-8 !h-8" />
        </div>
      )}

      {member && (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            {/* Cover + avatar */}
            <div className="h-48 bg-gradient-to-br from-primary to-primary-700 relative">
              {member.image && (
                <img src={`http://localhost:5000/${member.image}`} alt={member.name}
                  className="w-full h-full object-cover opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="px-6 pb-6 -mt-1">
              <div className="text-center mb-4 pt-4">
                <h2 className="text-2xl font-extrabold text-gray-800">{member.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{member.degree} · {member.year}</p>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: 'Roll Number', value: member.roll },
                  { label: 'Project', value: member.aboutProject },
                  { label: 'Certificate', value: member.certificate },
                  { label: 'Internship', value: member.internship },
                  { label: 'About Your Aim', value: member.aboutYourAim },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="font-semibold text-gray-600 min-w-[110px]">{label}:</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}

                {member.hobbies && (
                  <div>
                    <p className="font-semibold text-gray-600 mb-1.5">Hobbies:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.hobbies.split(',').map(h => (
                        <span key={h} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                          {h.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={onBack}
                className="btn-primary w-full mt-6 text-sm">
                ← Back to Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Team 16 Landing Page ────────────────────────────────────────────────
export default function NewLandingPage() {
  const [view, setView] = useState('home'); // 'home' | 'add' | 'view' | 'detail'
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const handleViewDetail = (id) => {
    setSelectedMemberId(id);
    setView('detail');
  };

  if (view === 'add')    return <AddMemberPage onBack={() => setView('home')} />;
  if (view === 'view')   return <ViewMembersPage onBack={() => setView('home')} onViewDetail={handleViewDetail} />;
  if (view === 'detail') return <MemberDetailPage memberId={selectedMemberId} onBack={() => setView('view')} />;

  // ── HOME ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans bg-surface">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-primary">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Shield size={20} />
          <span>CIVIC LENS</span>
        </div>
        <Link to="/"
          className="text-sm border border-white/60 text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-primary transition-colors font-medium flex items-center gap-1.5">
          <ArrowRight size={14} className="rotate-180" />
          Main Site
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-white px-6 py-14 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Users size={14} />
          Student Team Management App
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest mb-3 letter-spacing-wide">
          TEAM 16
        </h1>

        <p className="text-white/75 max-w-sm mx-auto mb-8 text-sm">
          Welcome to the Team 16 Management Portal — manage members, view profiles and track your squad.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => setView('add')}
            className="w-full sm:w-auto bg-white text-primary font-bold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-md">
            <UserPlus size={16} /> Add Member
          </button>
          <button onClick={() => setView('view')}
            className="w-full sm:w-auto border-2 border-white text-white font-bold px-7 py-3 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Eye size={16} /> View Members
          </button>
        </div>
      </section>

      {/* Tech Stack Badges */}
      <div className="max-w-lg mx-auto -mt-5 px-4">
        <div className="bg-white rounded-2xl shadow-card px-6 py-4 flex items-center justify-center gap-6 flex-wrap">
          {[
            { icon: Globe, label: 'React.js' },
            { icon: Code2, label: 'Node.js + Express' },
            { icon: Database, label: 'MongoDB' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Icon size={14} className="text-primary" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-extrabold text-center text-primary mb-2">What You Can Do</h2>
        <div className="w-10 h-1 bg-primary mx-auto rounded mb-10" />

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: UserPlus,
              title: 'Add Members',
              desc: 'Register team members with name, role, photo and personal details stored in MongoDB.',
            },
            {
              icon: Eye,
              title: 'View Members',
              desc: 'Browse all registered members with their profile photos and roll numbers.',
            },
            {
              icon: Users,
              title: 'Member Details',
              desc: 'Click any member to view their full profile including projects, hobbies and aims.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-modal transition-shadow">
              <div className="flex justify-center mb-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <Icon size={22} className="text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back to Civic Lens CTA */}
      <section className="bg-primary text-white px-6 py-12 text-center mx-4 rounded-3xl mb-14">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">Part of the Civic Lens Ecosystem</h2>
        <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto">
          This Team 16 portal is integrated with the Civic Lens smart city platform.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-md">
          <Shield size={16} />
          Go to Civic Lens
          <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="text-center py-5 text-gray-400 text-xs border-t">
        © 2024 CivicLens · Team 16 — Student Team Management
      </footer>
    </div>
  );
}
