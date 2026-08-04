import { useState, useEffect } from "react";
import { Search, X, CheckSquare, Square, Info, Eye, ClipboardList, RefreshCw, AlertCircle } from "lucide-react";
import API from "../api";

export default function Guides({ t, activeSubTab }) {
  // activeSubTab can be: "disease", "pest", "post-harvest"
  const [crops, setCrops] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [pests, setPests] = useState([]);
  const [postHarvestGuides, setPostHarvestGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("all");
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Post-harvest checked list state
  const [checkedItems, setCheckedItems] = useState({});

  const logActivity = async (action, descEn, descHi) => {
    try {
      await API.post("/activities", { action, descriptionEn: descEn, descriptionHi: descHi });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  useEffect(() => {
    if (activeSubTab === "post-harvest") {
      logActivity(
        "Post Harvest",
        "Opened Storage Checklist",
        "भंडारण चेकलिस्ट खोली"
      );
    } else if (activeSubTab === "disease") {
      logActivity(
        "Guide Viewed",
        "Opened Disease Guide",
        "रोग मार्गदर्शिका खोली"
      );
    } else if (activeSubTab === "pest") {
      logActivity(
        "Guide Viewed",
        "Opened Pest Guide",
        "कीट मार्गदर्शिका खोली"
      );
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (selectedDisease) {
      const nameEn = selectedDisease.nameEn;
      const nameHi = selectedDisease.nameHi;
      const type = activeSubTab === "pest" ? "Pest" : "Disease";
      const typeHi = activeSubTab === "pest" ? "कीट" : "रोग";
      logActivity(
        "Guide Viewed",
        `Viewed ${type} Guide: "${nameEn}"`,
        `${typeHi} मार्गदर्शिका देखी: "${nameHi}"`
      );
    }
  }, [selectedDisease, activeSubTab]);

  const toggleCheck = (id, idx) => {
    const key = `${id}-${idx}`;
    const newChecked = !checkedItems[key];
    setCheckedItems(prev => ({
      ...prev,
      [key]: newChecked
    }));

    if (newChecked) {
      const guide = postHarvestGuides.find(g => g.id === id);
      if (guide) {
        const itemEn = guide.itemsEn && guide.itemsEn[idx] ? guide.itemsEn[idx] : "Checklist Item";
        const itemHi = guide.itemsHi && guide.itemsHi[idx] ? guide.itemsHi[idx] : "चेकलिस्ट आइटम";
        const titleEn = guide.titleEn;
        const titleHi = guide.titleHi;
        logActivity(
          "Post Harvest",
          `Completed task: "${itemEn.length > 35 ? itemEn.substring(0, 35) + "..." : itemEn}" for ${titleEn}`,
          `${titleHi} के लिए कार्य पूरा किया: "${itemHi.length > 35 ? itemHi.substring(0, 35) + "..." : itemHi}"`
        );
      }
    }
  };

  const isHindi = t.activeLanguage === "Hindi";

  useEffect(() => {
    const fetchGuidesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cropsRes, diseasesRes, pestsRes, postHarvestRes] = await Promise.all([
          API.get("/crops"),
          API.get("/diseases"),
          API.get("/pests"),
          API.get("/post-harvest")
        ]);
        setCrops(cropsRes.data || []);
        setDiseases(diseasesRes.data || []);
        setPests(pestsRes.data || []);
        setPostHarvestGuides(postHarvestRes.data || []);
      } catch (err) {
        console.error("Failed to load guides:", err);
        setError(isHindi ? "मार्गदर्शिका डेटा लोड करने में विफल।" : "Failed to load guides data from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuidesData();
  }, [isHindi]);

  // Reset filter criteria when switching between sub-tabs
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery("");
    setSelectedCropFilter("all");
    setSelectedDisease(null);
  }, [activeSubTab]);

  // Filter Diseases with robust string and array safety guards
  const filteredDiseases = diseases.filter(d => {
    const nameHi = d.nameHi || "";
    const nameEn = d.nameEn || "";
    const pathogen = d.pathogen || "";
    const cropIds = d.cropIds || [];

    const matchesSearch = isHindi
      ? nameHi.toLowerCase().includes(searchQuery.toLowerCase()) || pathogen.toLowerCase().includes(searchQuery.toLowerCase())
      : nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || pathogen.toLowerCase().includes(searchQuery.toLowerCase());
    
    const cropMatches = selectedCropFilter === "all" || cropIds.includes(selectedCropFilter);
    return matchesSearch && cropMatches;
  });

  // Filter Pests with robust string and array safety guards
  const filteredPests = pests.filter(p => {
    const nameHi = p.nameHi || "";
    const nameEn = p.nameEn || "";
    const descHi = p.descriptionHi || "";
    const descEn = p.descriptionEn || "";
    const cropIds = p.cropIds || [];

    const matchesSearch = isHindi
      ? nameHi.toLowerCase().includes(searchQuery.toLowerCase()) || descHi.toLowerCase().includes(searchQuery.toLowerCase())
      : nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || descEn.toLowerCase().includes(searchQuery.toLowerCase());

    const cropMatches = selectedCropFilter === "all" || cropIds.includes(selectedCropFilter);
    return matchesSearch && cropMatches;
  });

  // Render Disease Guide
  const renderDiseaseGuide = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchGuidesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Crop Pills */}
        <div className="flex gap-2 overflow-x-auto flex-1 min-w-0 pb-1.5 custom-scrollbar">
          <button
            onClick={() => setSelectedCropFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
              selectedCropFilter === "all"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t.allCrops}
          </button>
          {crops.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCropFilter(c.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                selectedCropFilter === c.id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isHindi ? c.nameHi : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of disease cards */}
      {filteredDiseases.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Info className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map(d => {
            const cropNames = (d.cropIds || [])
              .map(cid => {
                const cr = crops.find(x => x.id === cid);
                return cr ? (isHindi ? cr.nameHi || cr.nameEn : cr.nameEn || cr.nameHi) : "";
              })
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={d.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition duration-200"
              >
                <div>
                  {/* Crop image thumbnail */}
                  <div className="h-40 overflow-hidden bg-slate-100 relative">
                    <img
                      src={d.image}
                      alt={isHindi ? d.nameHi : d.nameEn}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      style={{ transitionDuration: '0.4s' }}
                    />
                    <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {cropNames}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono">
                        {d.pathogen}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                        {isHindi ? d.nameHi : d.nameEn}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      <strong>{t.symptomsLabel}:</strong> {isHindi ? d.symptomsHi : d.symptomsEn}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-800/40">
                  <button
                    onClick={() => setSelectedDisease(d)}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition"
                  >
                    <Eye className="h-4 w-4" />
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header image */}
            <div className="h-48 relative">
              <img
                src={selectedDisease.image}
                alt={isHindi ? selectedDisease.nameHi : selectedDisease.nameEn}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="absolute top-4 right-4 rounded-full bg-slate-950/70 p-2 text-white hover:bg-slate-950 cursor-pointer border border-white/10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              
              <div className="absolute bottom-4 left-6 text-white space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                  {selectedDisease.pathogen}
                </span>
                <h3 className="text-xl font-extrabold font-display">
                  {isHindi ? selectedDisease.nameHi : selectedDisease.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t.affectedCropsLabel}
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {(selectedDisease.cropIds || [])
                    .map(cid => {
                      const cr = crops.find(x => x.id === cid);
                      return cr ? (isHindi ? cr.nameHi || cr.nameEn : cr.nameEn || cr.nameHi) : "";
                    })
                    .filter(Boolean)
                    .join(", ") || (isHindi ? "सभी फसलें" : "All Crops")}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {t.symptomsLabel}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                  {isHindi ? selectedDisease.symptomsHi || "जानकारी अनुपलब्ध है।" : selectedDisease.symptomsEn || "Symptoms information not available."}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  {t.preventionLabel}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                  {isHindi ? selectedDisease.preventionHi || "जानकारी अनुपलब्ध है।" : selectedDisease.preventionEn || "Prevention measures not available."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {t.treatmentLabel}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                  {isHindi ? selectedDisease.treatmentHi : selectedDisease.treatmentEn}
                </p>
              </div>
            </div>

            {/* Close footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 text-right">
              <button
                onClick={() => setSelectedDisease(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 text-xs font-semibold cursor-pointer transition shadow-sm"
              >
                {t.closeButton}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  // Render Pest Guide
  const renderPestGuide = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchGuidesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Crop Pills */}
        <div className="flex gap-2 overflow-x-auto flex-1 min-w-0 pb-1.5 custom-scrollbar">
          <button
            onClick={() => setSelectedCropFilter("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
              selectedCropFilter === "all"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t.allCrops}
          </button>
          {crops.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCropFilter(c.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                selectedCropFilter === c.id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isHindi ? c.nameHi : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Pest list cards */}
      {filteredPests.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Info className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPests.map(p => {
            const cropNames = (p.cropIds || [])
              .map(cid => {
                const cr = crops.find(x => x.id === cid);
                return cr ? (isHindi ? cr.nameHi || cr.nameEn : cr.nameEn || cr.nameHi) : "";
              })
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded-full bg-cyan-100/40 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-950/30 text-[10px] font-bold px-2.5 py-0.5">
                      {cropNames}
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                      {isHindi ? p.nameHi : p.nameEn}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHindi ? p.descriptionHi : p.descriptionEn}
                </p>

                <div className="border-t border-slate-50 dark:border-slate-800 pt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      {t.preventionLabel}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-350 mt-0.5 leading-relaxed">
                      {isHindi ? p.preventionHi : p.preventionEn}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-100 dark:border-slate-900">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      {t.treatmentLabel}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {isHindi ? p.controlHi : p.controlEn}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Render Post-Harvest Guide Checklist
  const renderPostHarvestGuide = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Loop all categories */}
          {postHarvestGuides.map(guide => (
            <div
              key={guide.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4"
            >
              {/* Card Title */}
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-emerald-600 dark:text-emerald-400">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {isHindi ? guide.titleHi : guide.titleEn}
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    {t.postHarvestTopicLabel}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {isHindi ? guide.descriptionHi : guide.descriptionEn}
              </p>

              {/* Checklist details */}
              <div className="border-t border-slate-50 dark:border-slate-800 pt-4 space-y-2.5">
                {(isHindi ? guide.itemsHi : guide.itemsEn).map((item, idx) => {
                  const itemKey = `${guide.id}-${idx}`;
                  const isChecked = !!checkedItems[itemKey];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(guide.id, idx)}
                      className={`flex gap-3 p-2.5 rounded-xl border transition cursor-pointer select-none ${
                        isChecked
                           ? "border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 text-slate-800 dark:text-slate-200"
                           : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <button className="flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          {activeSubTab === "disease" && t.diseaseGuide}
          {activeSubTab === "pest" && t.pestManagement}
          {activeSubTab === "post-harvest" && t.postHarvestGuide}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {activeSubTab === "disease" && (isHindi ? "उत्तराखंड की प्रमुख फसल बीमारियों की लक्षण एवं जैविक/रासायनिक उपचार गाइड।" : "Core database of crop diseases, symptoms, and organic or chemical treatments in Uttarakhand.")}
          {activeSubTab === "pest" && (isHindi ? "कीटों के प्रसार, रोकथाम और नियंत्रण उपायों की संदर्भ मार्गदर्शिका।" : "Reference directory for insect pest biology, field preventions, and control applications.")}
          {activeSubTab === "post-harvest" && (isHindi ? "गुणवत्ता नियंत्रण और कटाई के बाद के नुकसान को कम करने के लिए अनुपालन चेकलिस्ट।" : "Quality assurance and storage checklist guidelines to minimize post-harvest agricultural wastage.")}
        </p>
      </div>

      {/* Loading / Error / Content */}
      {error ? (
        <div className="rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/10 p-5 text-center flex items-center justify-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 animate-pulse" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-16">
          <RefreshCw className="h-6 w-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
            {isHindi ? "मार्गदर्शिका लोड हो रही है..." : "Loading directory guides..."}
          </span>
        </div>
      ) : (
        <>
          {/* Dynamic View rendering */}
          {activeSubTab === "disease" && renderDiseaseGuide()}
          {activeSubTab === "pest" && renderPestGuide()}
          {activeSubTab === "post-harvest" && renderPostHarvestGuide()}
        </>
      )}

    </div>
  );
}
