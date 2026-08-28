const HARRY_POTTER_API_URL = "https://hp-api.onrender.com/api/characters";
const OCTODEX_API_URLS = [
  "https://3195b4fb-27c8-4722-a947-eae239ec86f4.mock.pstmn.io/octocats",
  "https://octodex-rest-api-ccc20c6c9fbf.herokuapp.com/octocats"
];

const MATCH_BLUEPRINTS = [
  {
    hpName: "Hermione Granger",
    octoTitle: "Professortocat",
    traits: ["brilliant", "studious", "analytical"],
    reason: "Hermione and Professortocat both feel defined by sharp intellect, preparation, and a talent for guiding others with knowledge."
  },
  {
    hpName: "Luna Lovegood",
    octoTitle: "Surftocat",
    traits: ["free-spirited", "adventurous", "unconventional"],
    reason: "Luna and Surftocat share a calm confidence and a willingness to move through the world in their own delightfully unconventional way."
  },
  {
    hpName: "Rubeus Hagrid",
    octoTitle: "Parentocats",
    traits: ["protective", "nurturing", "loyal"],
    reason: "Hagrid and Parentocats are natural caretakers whose biggest strength is how fiercely they look after the people around them."
  },
  {
    hpName: "Ginny Weasley",
    octoTitle: "Boxertocat",
    traits: ["fearless", "competitive", "resilient"],
    reason: "Ginny and Boxertocat both project grit, confidence, and the kind of fearless energy that never backs down from a challenge."
  },
  {
    hpName: "Severus Snape",
    octoTitle: "Sentrytocat",
    traits: ["watchful", "guarded", "strategic"],
    reason: "Snape and Sentrytocat match through their vigilant, hard-to-read presence and their knack for protecting a larger mission from the shadows."
  }
];

const HARRY_POTTER_FALLBACKS = {
  "Hermione Granger": {
    name: "Hermione Granger",
    house: "Gryffindor",
    ancestry: "muggle-born",
    species: "human",
    patronus: "otter",
    image: ""
  },
  "Luna Lovegood": {
    name: "Luna Lovegood",
    house: "Ravenclaw",
    ancestry: "pure-blood",
    species: "human",
    patronus: "hare",
    image: ""
  },
  "Rubeus Hagrid": {
    name: "Rubeus Hagrid",
    house: "",
    ancestry: "half-giant",
    species: "half-giant",
    patronus: "",
    image: ""
  },
  "Ginny Weasley": {
    name: "Ginny Weasley",
    house: "Gryffindor",
    ancestry: "pure-blood",
    species: "human",
    patronus: "horse",
    image: ""
  },
  "Severus Snape": {
    name: "Severus Snape",
    house: "Slytherin",
    ancestry: "half-blood",
    species: "human",
    patronus: "doe",
    image: ""
  }
};

const OCTODEX_FALLBACKS = {
  Parentocats: {
    title: "Parentocats",
    octocat: "https://octodex.github.com/images/parentocats.png",
    authors: ["johncreek"]
  },
  Professortocat: {
    title: "Professortocat",
    octocat: "https://octodex.github.com/images/Professortocat_v2.png",
    authors: ["cameronmcefee"]
  },
  Sentrytocat: {
    title: "Sentrytocat",
    octocat: "https://octodex.github.com/images/Sentrytocat_octodex.jpg",
    authors: ["cameronmcefee"]
  },
  Boxertocat: {
    title: "Boxertocat",
    octocat: "https://octodex.github.com/images/boxertocat_octodex.jpg",
    authors: ["rubyjazzy"]
  },
  Surftocat: {
    title: "Surftocat",
    octocat: "https://octodex.github.com/images/surftocat.png",
    authors: ["jeejkang"]
  }
};

const matchesRoot = document.querySelector("#matches");
const template = document.querySelector("#match-template");
const hpStatus = document.querySelector("#hp-status");
const octoStatus = document.querySelector("#octo-status");

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchFirstAvailable(urls) {
  let lastError = new Error("No endpoint tried.");

  for (const url of urls) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function updateStatus(element, label, isLive) {
  element.textContent = `${label}: ${isLive ? "live data" : "fallback data"}`;
}

function asLookup(items, key) {
  return new Map(items.map((item) => [item[key], item]));
}

function normalizeOctodexResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function describeHarryPotterCharacter(character) {
  return [
    character.house || "House unknown",
    character.ancestry || "ancestry unknown",
    character.patronus ? `Patronus: ${character.patronus}` : null
  ].filter(Boolean).join(" • ");
}

function describeOctocat(character) {
  return [
    character.authors?.length ? `By ${character.authors.join(", ")}` : "Creator unknown",
    character.title
  ].join(" • ");
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function paintMedia(node, imageUrl, label) {
  node.textContent = "";
  node.style.backgroundImage = "";

  if (imageUrl) {
    node.style.backgroundImage = `linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(244, 114, 182, 0.15)), url("${imageUrl}")`;
    return;
  }

  node.textContent = getInitials(label);
}

function renderMatchCard(match) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".match-card");
  const characterCards = fragment.querySelectorAll(".character-card");
  const titles = fragment.querySelectorAll(".character-card__title");
  const metas = fragment.querySelectorAll(".character-card__meta");
  const mediaNodes = fragment.querySelectorAll(".character-card__media");
  const traitsRoot = fragment.querySelector(".trait-list");
  const reason = fragment.querySelector(".match-card__reason");

  card.dataset.match = `${match.hp.name}-${match.octo.title}`;

  titles[0].textContent = match.hp.name;
  metas[0].textContent = describeHarryPotterCharacter(match.hp);
  paintMedia(mediaNodes[0], match.hp.image, match.hp.name);

  titles[1].textContent = match.octo.title;
  metas[1].textContent = describeOctocat(match.octo);
  paintMedia(mediaNodes[1], match.octo.octocat, match.octo.title);

  reason.textContent = match.reason;

  match.traits.forEach((trait) => {
    const pill = document.createElement("span");
    pill.className = "trait-pill";
    pill.textContent = trait;
    traitsRoot.appendChild(pill);
  });

  characterCards[0].setAttribute("aria-label", `${match.hp.name} card`);
  characterCards[1].setAttribute("aria-label", `${match.octo.title} card`);

  return fragment;
}

function renderEmptyState(message) {
  matchesRoot.innerHTML = "";
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.textContent = message;
  matchesRoot.appendChild(emptyState);
}

async function loadMatches() {
  const [hpResult, octoResult] = await Promise.allSettled([
    fetchJson(HARRY_POTTER_API_URL),
    fetchFirstAvailable(OCTODEX_API_URLS)
  ]);

  const hpCharacters = hpResult.status === "fulfilled" ? hpResult.value : [];
  const octocats = octoResult.status === "fulfilled" ? normalizeOctodexResponse(octoResult.value) : [];

  updateStatus(hpStatus, "Harry Potter API", hpResult.status === "fulfilled");
  updateStatus(octoStatus, "Octodex API", octoResult.status === "fulfilled");

  const hpLookup = asLookup(hpCharacters, "name");
  const octoLookup = asLookup(octocats, "title");

  const matches = MATCH_BLUEPRINTS.map((blueprint) => ({
    ...blueprint,
    hp: hpLookup.get(blueprint.hpName) || HARRY_POTTER_FALLBACKS[blueprint.hpName],
    octo: octoLookup.get(blueprint.octoTitle) || OCTODEX_FALLBACKS[blueprint.octoTitle]
  })).filter((entry) => entry.hp && entry.octo);

  if (!matches.length) {
    renderEmptyState("No match data could be loaded.");
    return;
  }

  matchesRoot.innerHTML = "";
  matches.forEach((match) => matchesRoot.appendChild(renderMatchCard(match)));
}

loadMatches().catch(() => {
  updateStatus(hpStatus, "Harry Potter API", false);
  updateStatus(octoStatus, "Octodex API", false);
  renderEmptyState("The live APIs were unavailable, and the page could not assemble the curated matches.");
});
