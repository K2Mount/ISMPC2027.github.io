(function () {
  const targets = document.querySelectorAll("[data-speaker-role]");
  if (!targets.length) return;

  const scriptVersion = document.currentScript
    ? new URL(document.currentScript.src, window.location.href).searchParams.get("v")
    : "";
  const speakerDataUrl = scriptVersion
    ? `speakers-data.json?v=${encodeURIComponent(scriptVersion)}`
    : "speakers-data.json";

  const createCard = (speaker) => {
    const article = document.createElement("article");
    article.className = "speaker-card";
    article.dataset.speaker = speaker.photo.split("/").pop().replace(/\.[^.]+$/, "");

    const media = document.createElement("div");
    media.className = "speaker-media";

    const image = document.createElement("img");
    image.className = "speaker-card__portrait";
    image.src = speaker.photoVersion ? `${speaker.photo}?v=${encodeURIComponent(speaker.photoVersion)}` : speaker.photo;
    image.width = 900;
    image.height = 900;
    image.loading = "lazy";
    image.alt = `Portrait of ${speaker.name}`;

    media.appendChild(image);

    const content = document.createElement("div");
    content.className = "speaker-card__content";

    const name = document.createElement("h3");
    name.textContent = speaker.name;

    const divider = document.createElement("span");
    divider.className = "speaker-card__divider";
    divider.setAttribute("aria-hidden", "true");

    const affiliation = document.createElement("p");
    affiliation.className = "speaker-card__affiliation";
    affiliation.textContent = speaker.affiliation;

    const role = document.createElement("span");
    role.className = `tag tag--${speaker.role}`;
    role.textContent = `${speaker.role === "plenary" ? "Plenary" : "Keynote"} speaker`;

    const talk = document.createElement("p");
    talk.className = "speaker-card__talk";
    talk.textContent = speaker.talkTitle || "Talk title to be announced";

    content.append(name, divider, affiliation, role, talk);
    article.append(media, content);
    return article;
  };

  fetch(speakerDataUrl, { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`Speaker data request failed: ${response.status}`);
      return response.json();
    })
    .then((speakers) => {
      targets.forEach((target) => {
        const role = target.dataset.speakerRole;
        const fragment = document.createDocumentFragment();
        const group = speakers.filter((speaker) => speaker.role === role);
        if (role === "keynote") group.sort((a, b) => a.name.localeCompare(b.name));
        group.forEach((speaker) => fragment.appendChild(createCard(speaker)));
        target.replaceChildren(fragment);
        target.removeAttribute("aria-busy");
      });
    })
    .catch(() => {
      targets.forEach((target) => {
        target.removeAttribute("aria-busy");
        const message = document.createElement("p");
        message.className = "speaker-load-note";
        message.textContent = "Speaker details are temporarily unavailable. Please refresh the page or visit again shortly.";
        target.replaceChildren(message);
      });
    });
})();
