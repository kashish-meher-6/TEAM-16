import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, UserPlus, Eye, ArrowRight,
  ChevronRight, X, FileText, Upload, CheckCircle
} from 'lucide-react';
import axios from 'axios';

// ─── Field constraints ────────────────────────────────────────────────────────
const CONSTRAINTS = {
  name:         { min: 2,  max: 50,  pattern: /^[a-zA-Z\s.'-]+$/,      msg: 'Only letters, spaces and . \' - allowed' },
  roll:         { min: 5,  max: 20,  pattern: /^[A-Z0-9a-z]+$/,         msg: 'Only letters and numbers, no spaces' },
  year:         { min: 1,  max: 1,   pattern: /^[1-5]$/,                 msg: 'Enter a single digit 1–5' },
  degree:       { min: 2,  max: 60,  pattern: /^[a-zA-Z0-9\s().+/-]+$/, msg: 'Invalid characters in degree' },
  aboutProject: { min: 0,  max: 300, pattern: null,                      msg: 'Max 300 characters' },
  hobbies:      { min: 0,  max: 150, pattern: /^[a-zA-Z0-9,\s.'-]*$/,   msg: 'Only letters, numbers, commas allowed' },
  certificate:  { min: 0,  max: 150, pattern: null,                      msg: 'Max 150 characters' },
  internship:   { min: 0,  max: 150, pattern: null,                      msg: 'Max 150 characters' },
  aboutYourAim: { min: 0,  max: 300, pattern: null,                      msg: 'Max 300 characters' },
};

function validateField(name, value) {
  const c = CONSTRAINTS[name];
  if (!c) return '';
  const v = value.trim();
  if (c.min > 0 && v.length < c.min) return `Minimum ${c.min} characters required`;
  if (v.length > c.max) return `Maximum ${c.max} characters allowed`;
  if (c.pattern && v.length > 0 && !c.pattern.test(v)) return c.msg;
  return '';
}

// ─── Add Member Page ──────────────────────────────────────────────────────────
// ─── Add Member Page ──────────────────────────────────────────────────────────
function AddMemberPage({ onBack }) {
  const [form, setForm] = useState({
    name: '', roll: '', year: '', degree: '',
    aboutProject: '', hobbies: '', certificate: '',
    internship: '', aboutYourAim: '',
    image: null,
  });
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setErrors(er => ({ ...er, image: 'Only image files (JPG, PNG, etc.) are allowed' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(er => ({ ...er, image: 'Image must be under 5 MB' }));
        return;
      }
      setForm(f => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
      setErrors(er => ({ ...er, image: '' }));
      return;
    }

    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors(er => ({ ...er, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(er => ({ ...er, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    ['name','roll','year','degree','aboutProject','hobbies','certificate','internship','aboutYourAim']
      .forEach(k => {
        const err = validateField(k, form[k]);
        if (err) newErrors[k] = err;
      });
    if (!form.name.trim())   newErrors.name   = 'Name is required';
    if (!form.roll.trim())   newErrors.roll   = 'Roll number is required';
    if (!form.year.trim())   newErrors.year   = 'Year is required';
    if (!form.degree.trim()) newErrors.degree = 'Degree is required';

    setTouched({ name:true, roll:true, year:true, degree:true,
                 aboutProject:true, hobbies:true, certificate:true,
                 internship:true, aboutYourAim:true });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name',         form.name.trim());
      data.append('roll',         form.roll.trim());
      data.append('year',         form.year.trim());
      data.append('degree',       form.degree.trim());
      data.append('aboutProject', form.aboutProject);
      data.append('hobbies',      form.hobbies);
      data.append('certificate',  form.certificate);
      data.append('internship',   form.internship);
      data.append('aboutYourAim', form.aboutYourAim);
      if (form.image) data.append('image', form.image);

      await axios.post('http://localhost:5000/api/members', data);
      setSuccess(true);
    } catch {
      alert('Failed to add member. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setForm({ name:'',roll:'',year:'',degree:'',aboutProject:'',hobbies:'',
              certificate:'',internship:'',aboutYourAim:'',image:null });
    setPreview(null); setErrors({}); setTouched({});
  };

  if (success) return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-card p-10 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Member Added!</h2>
        <p className="text-gray-500 text-sm mb-6">Team member successfully saved to the database.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={resetForm} className="btn-primary text-sm px-5 py-2">Add Another</button>
          <button onClick={onBack}    className="btn-secondary text-sm px-5 py-2">Back to Home</button>
        </div>
      </div>
    </div>
  );

  const Field = ({ name, label, required, hint }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
        {label} {required && <span className="text-red-400">*</span>}
        {hint && <span className="normal-case font-normal text-gray-400 ml-1">({hint})</span>}
      </label>
      <input
        type="text" name={name} value={form[name]}
        onChange={handleChange} onBlur={handleBlur}
        maxLength={CONSTRAINTS[name]?.max}
        className={`input text-sm ${errors[name] ? 'border-red-400 focus:ring-red-200' : ''}`}
      />
      <div className="flex justify-between mt-0.5">
        <p className="text-red-500 text-xs">{errors[name] || ''}</p>
        {CONSTRAINTS[name]?.max && (
          <p className="text-gray-300 text-xs">{form[name].length}/{CONSTRAINTS[name].max}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold text-sm">
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
            <p className="text-white/70 text-sm mt-1">Fields marked <span className="text-red-300 font-bold">*</span> are required</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>

            {/* ── Required: Name ── */}
            <Field name="name"   label="Full Name"    required hint="letters only, 2–50 chars" />

            {/* ── Required: Roll + Year ── */}
            <div className="grid grid-cols-2 gap-3">
              <Field name="roll" label="Roll Number" required hint="e.g. RA2312704010002" />
              <Field name="year" label="Year"        required hint="1 – 5" />
            </div>

            {/* ── Required: Degree ── */}
            <Field name="degree" label="Degree / Program" required hint="e.g. B.Tech CSE" />

            {/* ── Optional textareas ── */}
            {[
              { name: 'aboutProject', label: 'About Project',  rows: 3 },
              { name: 'aboutYourAim', label: 'About Your Aim', rows: 3 },
            ].map(({ name, label, rows }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                <textarea
                  name={name} value={form[name]} rows={rows}
                  onChange={handleChange} onBlur={handleBlur}
                  maxLength={CONSTRAINTS[name].max}
                  className={`input text-sm resize-none ${errors[name] ? 'border-red-400' : ''}`}
                  placeholder={`Write your ${label.toLowerCase()}…`}
                />
                <div className="flex justify-between mt-0.5">
                  <p className="text-red-500 text-xs">{errors[name] || ''}</p>
                  <p className="text-gray-300 text-xs">{form[name].length}/{CONSTRAINTS[name].max}</p>
                </div>
              </div>
            ))}

            {/* ── Optional single-line ── */}
            <Field name="hobbies"     label="Hobbies"     hint="comma separated, max 150" />
            <Field name="certificate" label="Certificate" hint="max 150 chars" />
            <Field name="internship"  label="Internship"  hint="max 150 chars" />

            {/* ── Profile Photo (moved to bottom, label = Browse) ── */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden bg-surface flex items-center justify-center shrink-0">
                  {preview
                    ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    : <Users size={24} className="text-gray-300" />}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 border border-gray-300 bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Browse
                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">JPG / PNG · max 5 MB</p>
                  {errors.image && <p className="text-red-500 text-xs mt-0.5">{errors.image}</p>}
                  {preview && !errors.image && (
                    <button type="button" onClick={() => { setForm(f=>({...f,image:null})); setPreview(null); }}
                      className="text-xs text-gray-400 hover:text-red-500 mt-0.5 transition-colors">Remove</button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading
                ? <span className="spinner !w-4 !h-4" />
                : <><UserPlus size={16} /> Submit Member</>}
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
  const [error,   setError]   = React.useState('');

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/members')
      .then(r => setMembers(r.data))
      .catch(() => setError('Could not load members. Ensure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold text-sm">
          <Shield size={18} /><span>CIVIC LENS</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-normal opacity-80">Team 16 · Members</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-primary text-center mb-1">MEET OUR AMAZING TEAM 16</h1>
        <div className="w-12 h-1 bg-primary mx-auto rounded mb-8" />

        {loading && <div className="flex justify-center py-20"><div className="spinner !w-8 !h-8" /></div>}
        {error   && <div className="text-center py-16"><p className="text-red-500 text-sm">{error}</p></div>}
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
                    </div>}
              </div>
              <div className="p-4 text-center">
                <p className="font-bold text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Roll: {member.roll}</p>
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
  const [member,  setMember]  = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get(`http://localhost:5000/api/members/${memberId}`)
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
        <div className="flex items-center gap-2 font-bold text-sm">
          <Shield size={18} /><span>CIVIC LENS</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="font-normal opacity-80">Team 16 · Member Detail</span>
        </div>
      </div>

      {loading && <div className="flex justify-center py-32"><div className="spinner !w-8 !h-8" /></div>}

      {member && (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-primary to-primary-700 relative">
              {member.image && (
                <img src={`http://localhost:5000/${member.image}`} alt={member.name}
                  className="w-full h-full object-cover opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="px-6 pb-6">
              <div className="text-center mb-4 pt-4">
                <h2 className="text-2xl font-extrabold text-gray-800">{member.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{member.degree} · Year {member.year}</p>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: 'Roll Number',   value: member.roll },
                  { label: 'Project',       value: member.aboutProject },
                  { label: 'Certificate',   value: member.certificate },
                  { label: 'Internship',    value: member.internship },
                  { label: 'About My Aim',  value: member.aboutYourAim },
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

                {/* Document download link */}
                {member.document && (
                  <div className="mt-2 pt-3 border-t">
                    <p className="font-semibold text-gray-600 mb-1.5 text-xs uppercase tracking-wide">Attached Document</p>
                    <a href={`http://localhost:5000/${member.document}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                      <FileText size={16} />
                      View / Download Document
                    </a>
                  </div>
                )}
              </div>

              <button onClick={onBack} className="btn-primary w-full mt-6 text-sm">
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
  const [view, setView]                 = useState('home');
  const [selectedMemberId, setSelected] = useState(null);

  const handleViewDetail = (id) => { setSelected(id); setView('detail'); };

  if (view === 'add')    return <AddMemberPage onBack={() => setView('home')} />;
  if (view === 'view')   return <ViewMembersPage onBack={() => setView('home')} onViewDetail={handleViewDetail} />;
  if (view === 'detail') return <MemberDetailPage memberId={selectedMemberId} onBack={() => setView('view')} />;

  return (
    <div className="min-h-screen font-sans bg-surface">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-primary">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Shield size={20} /><span>CIVIC LENS</span>
        </div>
        <Link to="/"
          className="text-sm border border-white/60 text-white px-4 py-1.5 rounded-full hover:bg-white hover:text-primary transition-colors font-medium flex items-center gap-1.5">
          <ArrowRight size={14} className="rotate-180" /> Main Site
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-white px-6 py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Users size={14} /> Student Team Management App
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest mb-3">TEAM 16</h1>
        <p className="text-white/75 max-w-sm mx-auto mb-8 text-sm">
          Welcome to the Team 16 Management Portal — manage members, view profiles and track your squad.
        </p>
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

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-extrabold text-center text-primary mb-2">What You Can Do</h2>
        <div className="w-10 h-1 bg-primary mx-auto rounded mb-10" />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: UserPlus,  title: 'Add Members',    desc: 'Register team members with name, photo, documents and personal details stored in MongoDB.' },
            { icon: Eye,       title: 'View Members',   desc: 'Browse all registered members with their profile photos and roll numbers.' },
            { icon: Users,     title: 'Member Details', desc: 'Click any member to view their full profile including projects, hobbies and aims.' },
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

      {/* CTA */}
      <section className="bg-primary text-white px-6 py-12 text-center mx-4 rounded-3xl mb-14">
        <h2 className="text-xl md:text-2xl font-extrabold mb-2">Part of the Civic Lens Ecosystem</h2>
        <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto">
          This Team 16 portal is integrated with the Civic Lens smart city platform.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-md">
          <Shield size={16} /> Go to Civic Lens <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="text-center py-5 text-gray-400 text-xs border-t">
         2026 CivicLens · Team 16 — Student Team Management
      </footer>
    </div>
  );
}
