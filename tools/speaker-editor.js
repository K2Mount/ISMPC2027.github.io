(function () {
  const state = { speakers: [], selectedIndex: -1, dirty: false };
  const elements = {
    search: document.querySelector("#speaker-search"),
    roleFilter: document.querySelector("#role-filter"),
    count: document.querySelector("#speaker-count"),
    list: document.querySelector("#speaker-list"),
    add: document.querySelector("#add-speaker"),
    empty: document.querySelector("#empty-state"),
    form: document.querySelector("#speaker-form"),
    name: document.querySelector("#speaker-name"),
    affiliation: document.querySelector("#speaker-affiliation"),
    talkTitle: document.querySelector("#speaker-talk-title"),
    role: document.querySelector("#speaker-role"),
    photo: document.querySelector("#speaker-photo"),
    photoVersion: document.querySelector("#speaker-photo-version"),
    portrait: document.querySelector("#portrait-preview"),
    remove: document.querySelector("#remove-speaker"),
    status: document.querySelector("#editor-status"),
    copy: document.querySelector("#copy-json"),
    save: document.querySelector("#save-json")
  };

  const setStatus = (message) => {
    elements.status.textContent = message;
  };

  const publicPhotoUrl = (speaker) => {
    if (!speaker.photo) return "";
    const suffix = speaker.photoVersion ? `?v=${encodeURIComponent(speaker.photoVersion)}` : "";
    return `../${speaker.photo}${suffix}`;
  };

  const filteredSpeakers = () => {
    const query = elements.search.value.trim().toLocaleLowerCase();
    const role = elements.roleFilter.value;
    return state.speakers
      .map((speaker, index) => ({ speaker, index }))
      .filter(({ speaker }) => role === "all" || speaker.role === role)
      .filter(({ speaker }) => !query || `${speaker.name} ${speaker.affiliation}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => {
        if (a.speaker.role !== b.speaker.role) return a.speaker.role === "plenary" ? -1 : 1;
        return a.speaker.name.localeCompare(b.speaker.name);
      });
  };

  const renderList = () => {
    const entries = filteredSpeakers();
    elements.count.textContent = `${entries.length} of ${state.speakers.length} speakers`;
    const fragment = document.createDocumentFragment();

    entries.forEach(({ speaker, index }) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      if (index === state.selectedIndex) button.classList.add("is-active");

      const name = document.createElement("strong");
      name.textContent = speaker.name;
      const detail = document.createElement("small");
      detail.textContent = `${speaker.role === "plenary" ? "Plenary" : "Keynote"} · ${speaker.affiliation}`;
      button.append(name, detail);
      button.addEventListener("click", () => selectSpeaker(index));
      item.appendChild(button);
      fragment.appendChild(item);
    });

    elements.list.replaceChildren(fragment);
  };

  const updatePreview = () => {
    const draft = {
      photo: elements.photo.value.trim(),
      photoVersion: elements.photoVersion.value.trim()
    };
    elements.portrait.src = publicPhotoUrl(draft);
    elements.portrait.alt = elements.name.value.trim() ? `Portrait preview for ${elements.name.value.trim()}` : "Portrait preview";
    elements.portrait.classList.toggle("is-plenary", elements.role.value === "plenary");
  };

  const selectSpeaker = (index) => {
    const speaker = state.speakers[index];
    if (!speaker) return;
    state.selectedIndex = index;
    elements.empty.hidden = true;
    elements.form.hidden = false;
    elements.name.value = speaker.name || "";
    elements.affiliation.value = speaker.affiliation || "";
    elements.talkTitle.value = speaker.talkTitle || "";
    elements.role.value = speaker.role || "keynote";
    elements.photo.value = speaker.photo || "";
    elements.photoVersion.value = speaker.photoVersion || "";
    updatePreview();
    renderList();
  };

  const applyForm = ({ quiet = false } = {}) => {
    if (state.selectedIndex < 0 || !elements.form.reportValidity()) return false;
    const speaker = {
      ...state.speakers[state.selectedIndex],
      role: elements.role.value,
      name: elements.name.value.trim(),
      affiliation: elements.affiliation.value.trim(),
      photo: elements.photo.value.trim()
    };
    const photoVersion = elements.photoVersion.value.trim();
    const talkTitle = elements.talkTitle.value.trim();
    delete speaker.talkTitle;
    delete speaker.photoVersion;
    if (talkTitle) speaker.talkTitle = talkTitle;
    if (photoVersion) speaker.photoVersion = photoVersion;
    state.speakers[state.selectedIndex] = speaker;
    state.dirty = true;
    renderList();
    updatePreview();
    if (!quiet) setStatus(`Applied changes for ${speaker.name}. Save the JSON file when finished.`);
    return true;
  };

  const serialize = () => `${JSON.stringify(state.speakers, null, 2)}\n`;

  const downloadFallback = (content) => {
    const blob = new Blob([content], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speakers-data.json";
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus("Downloaded speakers-data.json. Replace the repository-root file with this download.");
  };

  const saveJson = async () => {
    if (state.selectedIndex >= 0 && !applyForm({ quiet: true })) return;
    const content = serialize();

    if ("showSaveFilePicker" in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "speakers-data.json",
          types: [{ description: "JSON data", accept: { "application/json": [".json"] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        state.dirty = false;
        setStatus("Saved speakers-data.json. Refresh the speaker preview to verify the result.");
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          setStatus("Save cancelled; no file was changed.");
          return;
        }
      }
    }

    downloadFallback(content);
  };

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyForm();
  });

  elements.search.addEventListener("input", renderList);
  elements.roleFilter.addEventListener("change", () => {
    const entries = filteredSpeakers();
    renderList();
    if (entries.length && !entries.some(({ index }) => index === state.selectedIndex)) {
      selectSpeaker(entries[0].index);
    }
  });
  elements.photo.addEventListener("input", updatePreview);
  elements.photoVersion.addEventListener("input", updatePreview);
  elements.name.addEventListener("input", updatePreview);
  elements.role.addEventListener("change", updatePreview);

  elements.add.addEventListener("click", () => {
    state.speakers.push({ role: "keynote", name: "New speaker", affiliation: "", photo: "assets/speakers-keynote/new-speaker.jpg" });
    selectSpeaker(state.speakers.length - 1);
    state.dirty = true;
    elements.name.select();
    setStatus("New speaker added in memory. Complete the form and save the JSON file.");
  });

  elements.remove.addEventListener("click", () => {
    const speaker = state.speakers[state.selectedIndex];
    if (!speaker || !window.confirm(`Remove ${speaker.name} from the speaker list?`)) return;
    state.speakers.splice(state.selectedIndex, 1);
    state.selectedIndex = -1;
    state.dirty = true;
    elements.form.hidden = true;
    elements.empty.hidden = false;
    renderList();
    setStatus(`${speaker.name} removed in memory. Save the JSON file to keep this change.`);
  });

  elements.copy.addEventListener("click", async () => {
    if (state.selectedIndex >= 0 && !applyForm({ quiet: true })) return;
    await navigator.clipboard.writeText(serialize());
    setStatus("Copied the complete speaker JSON to the clipboard.");
  });

  elements.save.addEventListener("click", saveJson);

  window.addEventListener("beforeunload", (event) => {
    if (!state.dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  fetch("../speakers-data.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((speakers) => {
      state.speakers = speakers;
      elements.copy.disabled = false;
      elements.save.disabled = false;
      renderList();
      if (speakers.length) selectSpeaker(0);
      state.dirty = false;
      setStatus("Speaker data loaded. Apply edits, then save speakers-data.json.");
    })
    .catch(() => {
      elements.count.textContent = "Unable to load speakers";
      setStatus("Could not load ../speakers-data.json. Open this tool through the local web server, not as a file.");
    });
})();
