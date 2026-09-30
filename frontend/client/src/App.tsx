// @ts-nocheck
import { useMemo, useRef, useState, useEffect  } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  IndianRupee,
  Languages,
  MapPin,
  Menu,
  Mic,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import VillageMap from "./components/VillageMap";
import FeasibilityCalculator from "./components/FeasibilityCalculator";

const opportunities = [
  { title: "Dairy collection point", type: "Dairy & livestock", location: "Belthangady block", amount: "₹2.8L", fit: 92, tone: "amber", icon: "🐄", note: "Nearest hub is 0.9 km away" },
  { title: "Coconut value-add unit", type: "Food processing", location: "Ujire gram panchayat", amount: "₹4.5L", fit: 84, tone: "green", icon: "🥥", note: "High raw material availability" },
  { title: "Women-led tailoring cluster", type: "Services & crafts", location: "Kokkada village", amount: "₹1.6L", fit: 76, tone: "violet", icon: "🧵", note: "12 local members interested" },
];

const languages = ["EN", "ಕನ್ನಡ", "हिन्दी"];

function StatCard({ icon: Icon, value, label, trend, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={18} /></div>
      <div className="min-w-0 flex-1"><p className="stat-value">{value}</p><p className="stat-label">{label}</p></div>
      {trend && <span className="trend"><TrendingUp size={13} />{trend}</span>}
    </div>
  );
}

function OpportunityCard({ item, saved, onSave }) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-top"><div className={`opportunity-emoji ${item.tone}`}>{item.icon}</div><button className={`save-button ${saved ? "saved" : ""}`} onClick={onSave} aria-label="Save opportunity">{saved ? <Check size={16} /> : <span>☆</span>}</button></div>
      <div className="opportunity-body"><div className="eyebrow">{item.type}</div><h3>{item.title}</h3><div className="location"><MapPin size={13} />{item.location}</div><div className="opportunity-meta"><div><span className="meta-label">Indicative capital</span><strong>{item.amount}</strong></div><div className="fit"><span className="meta-label">Local fit</span><strong>{item.fit}%</strong></div></div><div className="fit-bar"><span style={{ width: `${item.fit}%` }} /></div><p className="opportunity-note"><Check size={14} />{item.note}</p></div>
      <button className="text-action">View evidence <ArrowUpRight size={15} /></button>
    </article>
  );
}

export default function App() {
  const [language, setLanguage] = useState("EN");
  const [voiceState, setVoiceState] = useState("idle");
  const [transcription, setTranscription] = useState("");
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

const [showTranscription, setShowTranscription] = useState(false);
  const [saved, setSaved] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All opportunities");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => opportunities.filter((item) => (activeFilter === "All opportunities" || item.type === activeFilter) && `${item.title} ${item.location}`.toLowerCase().includes(query.toLowerCase())), [activeFilter, query]);
  const startVoiceRecording = async () => {
    try {
      console.log("🎤 Requesting microphone...");

      setShowTranscription(false);
      setTranscription("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      console.log("🎤 Microphone permission granted");

      let mimeType = "";

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        console.log("📦 Audio chunk:", event.data.size, "bytes");

        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
      };

      recorder.onstop = async () => {
        console.log("🛑 Recording stopped");

        setVoiceState("processing");

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        console.log("🎧 Recorded audio:", audioBlob.size, "bytes");

        if (audioBlob.size === 0) {
          setVoiceState("idle");
          alert("No audio was recorded.");
          return;
        }

        const formData = new FormData();

        formData.append(
          "file",
          audioBlob,
          "voice.webm"
        );

        try {
          console.log("📡 Sending audio to FastAPI...");

          const response = await fetch(
            "http://127.0.0.1:8000/pipeline/process-voice",
            {
              method: "POST",
              body: formData,
            }
          );

          console.log(
            "📡 Backend status:",
            response.status
          );

          if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
              `Server ${response.status}: ${errorText}`
            );
          }

          const data = await response.json();

          console.log(
            "✅ SraVaani response:",
            data
          );

          setTranscription(
            data.transcription || "No speech detected"
          );

          setShowTranscription(true);
          setVoiceState("transcribed");

        } catch (error) {
          console.error(
            "❌ Voice processing error:",
            error
          );

          setVoiceState("idle");

          alert(
            "Voice processing failed. Check the FastAPI terminal."
          );

        } finally {
          if (streamRef.current) {
            streamRef.current
              .getTracks()
              .forEach((track) => track.stop());

            streamRef.current = null;
          }

          mediaRecorderRef.current = null;
        }
      };

      recorder.start(250);

      setVoiceState("listening");

      console.log("🔴 RECORDING STARTED");
      console.log(
        "🎤 Recording will continue until you click the microphone again."
      );

    } catch (error) {
      console.error(
        "❌ Microphone error:",
        error
      );

      setVoiceState("idle");

      alert(
        "Microphone permission was denied or microphone is unavailable."
      );
    }
  };

  const stopVoiceRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      console.log("⚠️ No active recorder");
      return;
    }

    if (recorder.state !== "recording") {
      console.log(
        "⚠️ Recorder state:",
        recorder.state
      );
      return;
    }

    console.log("🛑 Manual stop requested");

    recorder.stop();
  };

  const handleVoice = () => {
    console.log(
      "🎤 Voice button:",
      voiceState
    );

    if (
      voiceState === "idle" ||
      voiceState === "transcribed"
    ) {
      startVoiceRecording();
      return;
    }

    if (voiceState === "listening") {
      stopVoiceRecording();
      return;
    }

    if (voiceState === "processing") {
      console.log(
        "⏳ Still processing..."
      );
    }
  };
  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="brand"><img className="brand-logo" src="/manus-storage/ChatGPTImageSep19,2026,12_46_45AM_5cbd478c.png" alt="GramRozgar — Karnataka rural opportunities" /></div>
      <div className="workspace-switcher"><div className="avatar">DK</div><div><span>My workspace</span><strong>Dakshina Kannada</strong></div><ChevronDown size={15} /></div>
      <nav><p className="nav-heading">Workspace</p><button className="nav-item active"><Activity size={17} />Overview</button><button className="nav-item" onClick={() => notify("Opportunity explorer is coming next") }><BriefcaseBusiness size={17} />Opportunities</button><button className="nav-item" onClick={() => notify("Reports are being prepared for your panchayat") }><FileCheck2 size={17} />Reports <span className="nav-badge">3</span></button><button className="nav-item" onClick={() => notify("Your saved opportunities are ready") }><WalletCards size={17} />Saved ideas</button><p className="nav-heading second">Tools</p><button className="nav-item" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}><Calculator size={17} />Funding calculator</button><button className="nav-item" onClick={() => notify("Help centre opened") }><CircleHelp size={17} />Help centre</button></nav>
      <div className="sidebar-foot"><div className="trust-mini"><ShieldCheck size={16} /><span><strong>Evidence protected</strong><small>Data refreshed 12 min ago</small></span></div><button className="profile-row" onClick={() => notify("Profile settings coming soon")}><div className="avatar profile">AS</div><span><strong>Arun Shetty</strong><small>Block coordinator</small></span><MoreHorizontal size={17} /></button></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div><div className="topbar-actions"><div className="language-select"><Languages size={15} />{language}<ChevronDown size={13} /><select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language"><option>EN</option><option>ಕನ್ನಡ</option><option>हिन्दी</option></select></div><button className="icon-button" onClick={() => notify("No new alerts") } aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><button className="help-button" onClick={() => notify("Help centre opened")}>Need help?</button></div></header>
      <main className="content">
        <section className="welcome-row"><div><div className="section-kicker"><span className="live-dot" />Panchayat workspace · Live</div><h1>Good morning, Arun <span>✦</span></h1><p>Turn local signals into better livelihood decisions for your community.</p></div><button className="outline-button" onClick={() => notify("Report export queued")}> <FileCheck2 size={16} /> Export report</button></section>
        <section className="hero-card"><div className="hero-copy"><div className="hero-pill"><Sparkles size={14} />AI-assisted, evidence-first</div><h2>What would you like to<br /><em>explore today?</em></h2><p>Ask in your own language. GramRozgar compares local demand, nearby enterprises, and available schemes before it recommends an idea.</p><div className="question-chip">“Can I start a dairy unit in our village?”</div></div><div className="voice-wrap"><button className={`voice-button ${voiceState}`} onClick={handleVoice} aria-label="Ask by voice"><span className="voice-ring ring-one" /><span className="voice-ring ring-two" /><Mic size={30} /> <span>{voiceState === "listening" ? "Listening…" : voiceState === "processing" ? "Thinking…" : voiceState === "transcribed" ? "Ask again" : "Tap to speak"}</span></button><div className="voice-meta"><span className="language-dot" />{language === "EN" ? "English" : language} · Voice enabled</div></div></section>
        {showTranscription && <div className="transcription"><div className="transcription-icon"><Check size={17} /></div><div><span>Question understood</span><strong>“{transcription}”</strong></div><button onClick={() => setShowTranscription(false)}><X size={16} /></button></div>}
        <section className="stats-grid"><StatCard icon={Users} value="1,284" label="Active workers in your block" trend="8.4%" color="teal" /><StatCard icon={TrendingUp} value="₹18.6L" label="Capital unlocked this month" trend="12.1%" color="orange" /><StatCard icon={MapPin} value="42" label="Verified local opportunities" trend="6 new" color="purple" /><StatCard icon={ShieldCheck} value="96%" label="Evidence confidence score" trend="Strong" color="blue" /></section>
        <div className="section-header"><div><p className="eyebrow">Decision support</p><h2>Explore local opportunities</h2><p>Recommendations shaped by evidence from your panchayat.</p></div><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ideas or places" /></div></div>
        <div className="filter-row">{["All opportunities", "Dairy & livestock", "Food processing", "Services & crafts"].map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <section className="opportunity-grid">{filtered.map((item, index) => <OpportunityCard key={item.title} item={item} saved={saved.includes(index)} onSave={() => { setSaved((current) => current.includes(index) ? current.filter((i) => i !== index) : [...current, index]); notify(saved.includes(index) ? "Removed from saved ideas" : "Saved to your workspace"); }} />)}{filtered.length === 0 && <div className="empty-state">No opportunities match that search yet.</div>}</section>
        <section className="insight-grid"><div className="map-shell"><div className="section-header compact"><div><p className="eyebrow">Ground truth</p><h2>Village economic map</h2><p>Verified activity around Belthangady.</p></div><button className="icon-button" onClick={() => notify("Map layers are up to date")}><MoreHorizontal size={18} /></button></div><VillageMap /></div><div id="calculator"><FeasibilityCalculator /></div></section>
        <section className="bottom-banner"><div className="banner-icon"><ShieldCheck size={22} /></div><div><strong>Every recommendation is explainable.</strong><p>We only use verified local signals, scheme eligibility, and transparent assumptions. No black-box promises.</p></div><button onClick={() => notify("Methodology guide opened")}>See our methodology <ArrowUpRight size={15} /></button></section>
      </main>
      <footer><span>GramRozgar · Built for better rural livelihoods</span><span>Last synced 12 minutes ago · <b>All systems operational</b></span></footer>
    </div>
    {notice && <div className="toast"><Check size={16} />{notice}</div>}
  </div>;
}

export { languages };
