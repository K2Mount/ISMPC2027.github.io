(function () {
  const portraitTargets = document.querySelectorAll("[data-speaker-role]");
  const invitedTarget = document.querySelector("[data-invited-speakers]");
  if (!portraitTargets.length && !invitedTarget) return;

  const scriptVersion = document.currentScript
    ? new URL(document.currentScript.src, window.location.href).searchParams.get("v")
    : "";
  const speakerDataUrl = scriptVersion
    ? `speakers-data.json?v=${encodeURIComponent(scriptVersion)}`
    : "speakers-data.json";
  const invitedDataUrl = scriptVersion
    ? `invited-speakers-data.json?v=${encodeURIComponent(scriptVersion)}`
    : "invited-speakers-data.json";

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

  const createInvitedItem = (speaker) => {
    const article = document.createElement("article");
    article.className = "invited-speaker-item";

    const name = document.createElement("h3");
    name.textContent = speaker.name;

    const affiliation = document.createElement("p");
    affiliation.textContent = speaker.affiliation;

    article.append(name, affiliation);
    return article;
  };

  if (portraitTargets.length) {
    fetch(speakerDataUrl, { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Speaker data request failed: ${response.status}`);
        return response.json();
      })
      .then((speakers) => {
        portraitTargets.forEach((target) => {
          const role = target.dataset.speakerRole;
          const fragment = document.createDocumentFragment();
          const group = speakers.filter((speaker) => speaker.role === role);
          if (role === "keynote") group.sort((a, b) => a.name.localeCompare(b.name));
          group.forEach((speaker) => fragment.appendChild(createCard(speaker)));
          target.replaceChildren(fragment);
          target.removeAttribute("aria-busy");
          document.querySelectorAll(`[data-speaker-count="${role}"]`).forEach((count) => {
            count.textContent = `${group.length} confirmed`;
          });
        });
      })
      .catch(() => {
        portraitTargets.forEach((target) => {
          target.removeAttribute("aria-busy");
          const message = document.createElement("p");
          message.className = "speaker-load-note";
          message.textContent = "Speaker details are temporarily unavailable. Please refresh the page or visit again shortly.";
          target.replaceChildren(message);
        });
      });
  }

  if (invitedTarget) {
    fetch(invitedDataUrl, { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Invited-speaker data request failed: ${response.status}`);
        return response.json();
      })
      .then((speakers) => {
        const fragment = document.createDocumentFragment();
        speakers.forEach((speaker) => fragment.appendChild(createInvitedItem(speaker)));
        invitedTarget.replaceChildren(fragment);
        invitedTarget.removeAttribute("aria-busy");
        document.querySelectorAll("[data-invited-count]").forEach((count) => {
          count.textContent = `${speakers.length} confirmed`;
        });
      })
      .catch(() => {
        invitedTarget.removeAttribute("aria-busy");
        const message = document.createElement("p");
        message.className = "speaker-load-note";
        message.textContent = "The invited-speaker list is temporarily unavailable. Please refresh the page or visit again shortly.";
        invitedTarget.replaceChildren(message);
      });
  }
})();
