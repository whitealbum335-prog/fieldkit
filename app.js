const $ = (selector) => document.querySelector(selector);

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".panel").forEach((panel) => {
      const active = panel.id === `panel-${button.dataset.panel}`;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
  });
});

function filterTools() {
  const query = $("#tool-search").value.trim().toLowerCase();
  const buttons = Array.from(document.querySelectorAll(".nav-item"));
  const visible = [];
  buttons.forEach((button) => {
    const panel = $(`#panel-${button.dataset.panel}`);
    const matches = !query || `${button.textContent} ${panel.textContent}`.toLowerCase().includes(query);
    button.hidden = !matches;
    if (matches) visible.push(button);
  });
  $("#tool-search-status").textContent = query
    ? `${visible.length} tool${visible.length === 1 ? "" : "s"} found. Press Enter to open the first.`
    : `${buttons.length} tools available.`;
}

$("#tool-search").addEventListener("input", filterTools);
$("#tool-search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector(".nav-item:not([hidden])")?.click();
  }
});
filterTools();

$("#theme-toggle").addEventListener("click", (event) => {
  const light = document.body.dataset.theme !== "light";
  document.body.dataset.theme = light ? "light" : "dark";
  event.currentTarget.setAttribute("aria-pressed", String(light));
  event.currentTarget.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
  $("#theme-icon").textContent = light ? "☾" : "☀";
  $("#theme-label").textContent = light ? "Dark mode" : "Light mode";
  $("#theme-color").content = light ? "#f5f7fb" : "#101522";
});

document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`.nav-item[data-panel="${button.dataset.openPanel}"]`)?.click();
  });
});

function filterResources() {
  const query = $("#resource-search").value.trim().toLowerCase();
  const category = $("#resource-category").value;
  const cards = Array.from(document.querySelectorAll(".resource-card"));
  let visibleCount = 0;
  cards.forEach((card) => {
    const matchesText = `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
    const matchesCategory = category === "all" || card.dataset.category === category;
    const visible = matchesText && matchesCategory;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  $("#resource-count").textContent = `${visibleCount} resource${visibleCount === 1 ? "" : "s"} shown. Search runs locally.`;
  $("#resource-empty").hidden = visibleCount !== 0;
}

$("#resource-search").addEventListener("input", filterResources);
$("#resource-category").addEventListener("change", filterResources);
filterResources();

function setDetail(selector, value) {
  $(selector).textContent = value || "Not provided";
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable";
const privacyPreference = navigator.globalPrivacyControl === true
  ? "Global Privacy Control enabled"
  : navigator.doNotTrack === "1"
    ? "Do Not Track enabled"
    : navigator.globalPrivacyControl === false || navigator.doNotTrack === "0"
      ? "No opt-out preference detected"
      : "Not specified by browser";

setDetail("#browser-secure", window.isSecureContext ? "Yes" : "No");
setDetail("#browser-cookies", navigator.cookieEnabled ? "Available" : "Disabled");
setDetail("#browser-privacy", privacyPreference);
setDetail("#browser-language", navigator.language || "Unavailable");
setDetail("#browser-timezone", timezone);
setDetail("#browser-screen", window.screen ? `${screen.width} × ${screen.height}` : "Unavailable");

function setFeedback(element, message, kind = "") {
  element.textContent = message;
  element.className = `feedback${kind ? ` ${kind}` : ""}`;
}

async function copyOutput(output, feedback) {
  const value = output.textContent.trim();
  if (!value || value === "—" || value === "Your password will appear here") {
    setFeedback(feedback, "There is nothing to copy.", "error");
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    setFeedback(feedback, "Copied to clipboard.", "success");
  } catch {
    setFeedback(feedback, "Clipboard access is unavailable. Select and copy the result manually.", "error");
  }
}

$("#toggle-password").addEventListener("click", (event) => {
  const input = $("#password-input");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  event.currentTarget.textContent = show ? "Hide" : "Show";
  event.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

$("#password-input").addEventListener("input", () => {
  const password = $("#password-input").value;
  const meter = $("#strength-meter");
  const result = $("#strength-result");
  const tips = $("#password-tips");

  if (!password) {
    meter.style.width = "0";
    result.textContent = "Enter a password to check it.";
    result.className = "result muted";
    tips.replaceChildren();
    return;
  }

  const pools = [
    /[a-z]/.test(password) ? 26 : 0,
    /[A-Z]/.test(password) ? 26 : 0,
    /[0-9]/.test(password) ? 10 : 0,
    /[^a-zA-Z0-9]/.test(password) ? 33 : 0
  ].reduce((sum, size) => sum + size, 0);
  const repeated = /(.)\1{3,}/.test(password);
  const common = /^(password|qwerty|letmein|admin|welcome|123456|iloveyou)(\d{0,4}[!@#$%^&*]*)?$/i.test(password);
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (pools >= 60) score += 1;
  if (repeated) score = Math.max(0, score - 1);
  if (common) score = 0;
  score = Math.min(4, score);
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#ff7777", "#ff9478", "#f0c77b", "#9bd5aa", "#9de3c0"];
  meter.style.width = `${Math.max(8, (score + 1) * 20)}%`;
  meter.style.background = colors[score];
  result.textContent = `${labels[score]} · rule-of-thumb estimate`;
  result.className = `result ${score >= 3 ? "strong" : score === 2 ? "medium" : ""}`;

  const advice = [];
  if (password.length < 14) advice.push("Use at least 14 characters.");
  if (pools < 60) advice.push("Mix upper/lowercase letters, numbers, and symbols.");
  if (repeated) advice.push("Avoid long runs of the same character.");
  if (common) advice.push("Avoid common passwords and simple variations.");
  tips.replaceChildren(...advice.map((tip) => {
    const item = document.createElement("li");
    item.textContent = tip;
    return item;
  }));
});

$("#password-length").addEventListener("input", (event) => {
  $("#length-label").textContent = event.currentTarget.value;
});

function randomIndex(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return values[0] % max;
}

function secureString(length, alphabet) {
  let result = "";
  for (let i = 0; i < length; i += 1) result += alphabet[randomIndex(alphabet.length)];
  return result;
}

$("#generate-password").addEventListener("click", () => {
  const sets = [
    ["#include-upper", "ABCDEFGHJKLMNPQRSTUVWXYZ"],
    ["#include-lower", "abcdefghijkmnopqrstuvwxyz"],
    ["#include-numbers", "23456789"],
    ["#include-symbols", "!@#$%^&*()-_=+[]{}?"]
  ].filter(([selector]) => $(selector).checked).map(([, alphabet]) => alphabet);
  const length = Number($("#password-length").value);
  const status = $("#generator-status");
  if (!sets.length) {
    setFeedback(status, "Choose at least one character type.", "error");
    return;
  }
  if (length < sets.length) {
    setFeedback(status, "Increase the length to fit each selected character type.", "error");
    return;
  }
  try {
    const allCharacters = sets.join("");
    const characters = sets.map((set) => secureString(1, set));
    characters.push(...secureString(length - characters.length, allCharacters));
    for (let i = characters.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    $("#generated-password").textContent = characters.join("");
    setFeedback(status, "Generated locally. Save it in a trusted password manager.", "success");
  } catch {
    setFeedback(status, "Secure randomness is unavailable in this browser context. Open this page over HTTPS or localhost.", "error");
  }
});

$("#copy-password").addEventListener("click", () => copyOutput($("#generated-password"), $("#generator-status")));

$("#check-breached-password").addEventListener("click", async (event) => {
  const input = $("#breach-password");
  const button = event.currentTarget;
  const status = $("#breach-password-status");
  let password = input.value;
  input.value = "";

  if (!password) {
    setFeedback(status, "Enter a password to check. It will be cleared after the check.", "error");
    return;
  }
  if (!window.crypto?.subtle) {
    setFeedback(status, "Secure hashing is unavailable. Use a modern browser over HTTPS or localhost.", "error");
    return;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  button.disabled = true;
  setFeedback(status, "Hashing locally and checking the privacy-preserving range…");
  try {
    const hashBuffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
    const hash = Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
    password = "";
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Password-check service returned HTTP ${response.status}.`);
    const body = await response.text();
    let occurrences = 0;
    for (const line of body.split(/\r?\n/)) {
      const match = /^([0-9A-F]{35}):(\d+)$/i.exec(line.trim());
      if (match && match[1].toUpperCase() === suffix) {
        occurrences = Number(match[2]);
        break;
      }
    }

    if (occurrences > 0) {
      setFeedback(status, `Found ${occurrences.toLocaleString()} appearances in known breach data. Change it anywhere you use it; choose a unique password for each account.`, "error");
    } else {
      setFeedback(status, "No match in the current dataset. This does not guarantee the password is safe; use a long, unique password.", "success");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      setFeedback(status, "The check timed out. Try again later.", "error");
    } else {
      setFeedback(status, error instanceof Error ? `${error.message} Check the service and try again.` : "The check failed. Check your connection and try again.", "error");
    }
  } finally {
    window.clearTimeout(timeout);
    password = "";
    input.value = "";
    button.disabled = false;
  }
});

$("#make-hash").addEventListener("click", async () => {
  const status = $("#hash-status");
  try {
    if (!window.crypto?.subtle) throw new Error("Web Crypto is unavailable.");
    const bytes = new TextEncoder().encode($("#hash-input").value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    $("#hash-output").textContent = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    setFeedback(status, "Digest generated locally.", "success");
  } catch {
    setFeedback(status, "Could not generate the hash. Use a modern browser over HTTPS or localhost.", "error");
  }
});

$("#copy-hash").addEventListener("click", () => copyOutput($("#hash-output"), $("#hash-status")));

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function fromBase64(encoded) {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function toHex(text) {
  return Array.from(new TextEncoder().encode(text), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex) {
  const normalized = hex.replace(/\s+/g, "");
  if (normalized.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(normalized)) throw new Error("Enter an even number of valid hexadecimal characters.");
  const bytes = new Uint8Array(normalized.match(/.{2}/g)?.map((pair) => Number.parseInt(pair, 16)) ?? []);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

$("#run-encoding").addEventListener("click", () => {
  const type = $("#encoding-type").value;
  const mode = $("#encoding-mode").value;
  const input = $("#encoding-input").value;
  const status = $("#encoding-status");
  try {
    let result;
    if (type === "base64") result = mode === "encode" ? toBase64(input) : fromBase64(input);
    if (type === "url") result = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    if (type === "hex") result = mode === "encode" ? toHex(input) : fromHex(input);
    $("#encoding-output").textContent = result;
    setFeedback(status, "Conversion complete.", "success");
  } catch (error) {
    setFeedback(status, error instanceof Error ? error.message : "Invalid input for the selected format.", "error");
  }
});

$("#copy-encoding").addEventListener("click", () => copyOutput($("#encoding-output"), $("#encoding-status")));

$("#check-gmail").addEventListener("click", () => {
  const address = $("#gmail-address").value.trim();
  const links = $("#gmail-links");
  links.hidden = true;
  $("#gmail-return").hidden = true;
  $("#gmail-followup").textContent = "";
  if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    setFeedback($("#gmail-status"), "Enter a valid email address. This check stays in your browser.", "error");
    return;
  }
  const domain = address.slice(address.lastIndexOf("@") + 1).toLowerCase();
  if (domain !== "gmail.com" && domain !== "googlemail.com") {
    setFeedback($("#gmail-status"), "That address does not appear to use Gmail. You can still use the breach checker for an address you own.", "error");
    return;
  }
  $("#hibp-lookup-link").href = `https://haveibeenpwned.com/account/${encodeURIComponent(address)}`;
  $("#gmail-return").hidden = false;
  setFeedback($("#gmail-status"), "Address format looks valid. Fieldkit has not sent it; choose an external service below if you want to continue.", "success");
  links.hidden = false;
});

document.querySelectorAll("[data-gmail-result]").forEach((button) => {
  button.addEventListener("click", () => {
    const response = {
      none: "HIBP lists no known breaches for this address in its current data. This does not guarantee the address was never exposed; keep using unique passwords and two-step verification.",
      found: "Treat the account as exposed: change reused passwords on every affected service, use unique passwords from a password manager, enable two-step verification, and review Google Security Checkup. Never reuse a password from a breach.",
      unknown: "No result was recorded. Try the official lookup again later or review Google Security Checkup and enable two-step verification."
    };
    document.querySelectorAll("[data-gmail-result]").forEach((option) => {
      option.classList.toggle("selected", option === button);
      option.setAttribute("aria-pressed", option === button ? "true" : "false");
    });
    setFeedback($("#gmail-followup"), response[button.dataset.gmailResult], "success");
  });
});

const ownAccounts = [];

function renderOwnAccounts() {
  const list = $("#own-account-list");
  list.replaceChildren(...ownAccounts.map((account, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const remove = document.createElement("button");
    label.textContent = `${account.platform}: ${account.username}`;
    remove.type = "button";
    remove.className = "icon-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${account.platform} account ${account.username}`);
    remove.addEventListener("click", () => {
      ownAccounts.splice(index, 1);
      renderOwnAccounts();
      $("#username-results").hidden = true;
      setFeedback($("#username-entry-status"), "Account removed from this temporary audit.");
    });
    item.append(label, remove);
    return item;
  }));
}

$("#add-own-account").addEventListener("click", () => {
  const platform = $("#account-platform").value;
  const username = $("#account-username").value.trim().replace(/^@/, "");
  const status = $("#username-entry-status");

  if (!username || username.length > 64 || /[\s/?#]/.test(username)) {
    setFeedback(status, "Enter a username without spaces or URL characters.", "error");
    return;
  }
  if (ownAccounts.length >= 100) {
    setFeedback(status, "This temporary audit supports up to 100 accounts.", "error");
    return;
  }

  ownAccounts.push({ platform, username });
  $("#account-username").value = "";
  $("#username-results").hidden = true;
  renderOwnAccounts();
  setFeedback(status, "Added to this temporary, local-only audit.", "success");
});

$("#account-username").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#add-own-account").click();
  }
});

$("#check-username-reuse").addEventListener("click", () => {
  const status = $("#username-status");
  const results = $("#username-results");
  const resultList = $("#username-result-list");
  results.hidden = true;
  resultList.replaceChildren();

  if (!ownAccounts.length) {
    setFeedback(status, "Add accounts you own before checking for reused usernames.", "error");
    return;
  }

  const handles = new Map();
  ownAccounts.forEach((account) => {
    const key = account.username.normalize("NFKC").toLocaleLowerCase();
    if (!handles.has(key)) handles.set(key, []);
    handles.get(key).push(account);
  });

  const reused = Array.from(handles.values()).filter((accounts) => accounts.length > 1);
  if (reused.length === 0) {
    const item = document.createElement("li");
    item.textContent = `No repeated usernames found across ${ownAccounts.length} account${ownAccounts.length === 1 ? "" : "s"} in your list.`;
    resultList.append(item);
    setFeedback(status, "Check complete. Your account list stayed in this browser.", "success");
  } else {
    reused.forEach((accounts) => {
      const item = document.createElement("li");
      item.textContent = `“${accounts[0].username}” is reused on: ${accounts.map((account) => account.platform).join(", ")}.`;
      resultList.append(item);
    });
    setFeedback(status, `Found ${reused.length} reused handle${reused.length === 1 ? "" : "s"}. Consider changing them on accounts you own.`, "success");
  }
  results.hidden = false;
});

function normalizeDomain(value) {
  const domain = value.trim().replace(/\.$/, "").toLowerCase();
  if (domain.length > 253 || domain.length === 0) throw new Error("Enter a valid domain name, such as example.com.");
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) => (
    label.length > 63 ||
    !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  )) || !/[a-z]/i.test(labels[labels.length - 1])) {
    throw new Error("Enter a valid public domain name, such as example.com.");
  }
  return domain;
}

function rdapEventDate(events, action) {
  const event = events.find((item) => item.eventAction === action && typeof item.eventDate === "string");
  if (!event) return "Not provided";
  const date = new Date(event.eventDate);
  return Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString();
}

function rdapRegistrar(entities) {
  const registrar = entities.find((entity) => Array.isArray(entity.roles) && entity.roles.includes("registrar"));
  const card = registrar?.vcardArray;
  if (!Array.isArray(card) || !Array.isArray(card[1])) return "Not provided";
  const fullName = card[1].find((item) => Array.isArray(item) && item[0] === "fn");
  return typeof fullName?.[3] === "string" && fullName[3].trim() ? fullName[3].trim() : "Not provided";
}

$("#run-domain-lookup").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const status = $("#domain-status");
  const results = $("#domain-results");
  let domain;
  try {
    domain = normalizeDomain($("#domain-input").value);
  } catch (error) {
    results.hidden = true;
    setFeedback(status, error instanceof Error ? error.message : "Enter a valid domain name.", "error");
    return;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  button.disabled = true;
  results.hidden = true;
  setFeedback(status, "Contacting the public RDAP service…");
  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: "application/rdap+json, application/json" },
      signal: controller.signal
    });
    if (response.status === 404) throw new Error("No public RDAP registration record was found for this domain.");
    if (!response.ok) throw new Error(`RDAP service returned HTTP ${response.status}.`);
    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];
    const entities = Array.isArray(data.entities) ? data.entities : [];
    const nameservers = Array.isArray(data.nameservers)
      ? data.nameservers.map((server) => server.ldhName).filter((name) => typeof name === "string").slice(0, 8)
      : [];
    const statusCodes = Array.isArray(data.status)
      ? data.status.filter((code) => typeof code === "string").slice(0, 8)
      : [];

    setDetail("#domain-name", typeof data.ldhName === "string" ? data.ldhName : domain);
    setDetail("#domain-registrar", rdapRegistrar(entities));
    setDetail("#domain-registered", rdapEventDate(events, "registration"));
    setDetail("#domain-expires", rdapEventDate(events, "expiration"));
    setDetail("#domain-dnssec", typeof data.secureDNS?.delegationSigned === "boolean"
      ? data.secureDNS.delegationSigned ? "Signed" : "Not signed"
      : "Not provided");
    setDetail("#domain-state", statusCodes.length ? statusCodes.join(", ") : "Not provided");
    const nameserverText = nameservers.length
      ? `${nameservers.join(", ")}${data.nameservers.length > nameservers.length ? `, +${data.nameservers.length - nameservers.length} more` : ""}`
      : "Not provided";
    setDetail("#domain-nameservers", nameserverText);
    results.hidden = false;
    setFeedback(status, "Public technical registration data received.", "success");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      setFeedback(status, "The lookup timed out. Check your connection and try again.", "error");
    } else {
      setFeedback(status, error instanceof Error ? `${error.message} Check the service and try again.` : "The lookup failed. Check your connection and try again.", "error");
    }
  } finally {
    window.clearTimeout(timeout);
    button.disabled = false;
  }
});

function parseIPv4(value) {
  const parts = value.trim().split(".");
  if (parts.length !== 4 || parts.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) {
    throw new Error("Enter a valid IPv4 address.");
  }
  return parts.reduce((address, part) => (address << 8n) | BigInt(part), 0n);
}

function formatIPv4(value) {
  return [24n, 16n, 8n, 0n].map((shift) => Number((value >> shift) & 255n)).join(".");
}

$("#calculate-network").addEventListener("click", () => {
  const status = $("#network-status");
  try {
    const address = parseIPv4($("#network-ip").value);
    const prefix = Number($("#network-prefix").value);
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("CIDR prefix must be between 0 and 32.");
    const allBits = 0xffffffffn;
    const mask = prefix === 0 ? 0n : (allBits << BigInt(32 - prefix)) & allBits;
    const network = address & mask;
    $("#network-address").textContent = formatIPv4(network);
    $("#subnet-mask").textContent = formatIPv4(mask);
    $("#broadcast-address").textContent = formatIPv4(network | (allBits ^ mask));
    $("#address-count").textContent = (2 ** (32 - prefix)).toLocaleString();
    $("#network-results").hidden = false;
    setFeedback(status, "Calculation complete.", "success");
  } catch (error) {
    $("#network-results").hidden = true;
    setFeedback(status, error instanceof Error ? error.message : "Could not calculate this subnet.", "error");
  }
});

$("#run-connection-check").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const status = $("#connection-status");
  const results = $("#connection-results");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  button.disabled = true;
  results.hidden = true;
  setFeedback(status, "Requesting your public connection details…");

  try {
    const response = await fetch("https://ipwho.is/", {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`The lookup service returned HTTP ${response.status}.`);
    const data = await response.json();
    if (data.success !== true || typeof data.ip !== "string") {
      throw new Error(typeof data.message === "string" ? data.message : "The lookup service could not identify this connection.");
    }

    const network = data.connection && typeof data.connection === "object" ? data.connection : {};
    const zone = data.timezone && typeof data.timezone === "object" ? data.timezone : {};
    setDetail("#connection-ip", data.ip);
    setDetail("#connection-version", data.type);
    setDetail("#connection-provider", network.isp || network.org);
    setDetail("#connection-asn", network.asn ? `AS${network.asn}${network.org ? ` · ${network.org}` : ""}` : network.org);
    setDetail("#connection-region", [data.region, data.country].filter(Boolean).join(", "));
    setDetail("#connection-timezone", zone.id);
    results.hidden = false;
    setFeedback(status, "Connection details loaded. Region estimates may be inaccurate.", "success");
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      setFeedback(status, "The lookup timed out. Check your connection and try again.", "error");
    } else {
      setFeedback(status, error instanceof Error ? `${error.message} Check the service and try again.` : "The lookup failed. Check your connection and try again.", "error");
    }
  } finally {
    window.clearTimeout(timeout);
    button.disabled = false;
  }
});

function isPublicIPv4(value) {
  const first = Number(value >> 24n);
  const second = Number((value >> 16n) & 255n);
  const third = Number((value >> 8n) & 255n);
  if (first === 0 || first === 10 || first === 127 || first >= 224) return false;
  if (first === 100 && second >= 64 && second <= 127) return false;
  if (first === 169 && second === 254) return false;
  if (first === 172 && second >= 16 && second <= 31) return false;
  if (first === 192 && (second === 168 || (second === 0 && third === 0) || (second === 0 && third === 2))) return false;
  if (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) return false;
  if (first === 203 && second === 0 && third === 113) return false;
  return true;
}

$("#run-lookup").addEventListener("click", async () => {
  const status = $("#lookup-status");
  $("#lookup-results").hidden = true;
  let address;
  try {
    address = parseIPv4($("#lookup-ip").value);
    if (!isPublicIPv4(address)) throw new Error("Enter a globally routable public IPv4 address.");
  } catch (error) {
    setFeedback(status, error instanceof Error ? error.message : "Enter a valid public IPv4 address.", "error");
    return;
  }

  setFeedback(status, "Contacting the public RDAP service…");
  try {
    const response = await fetch(`https://rdap.org/ip/${encodeURIComponent($("#lookup-ip").value.trim())}`, {
      headers: { Accept: "application/rdap+json, application/json" }
    });
    if (!response.ok) throw new Error(`RDAP service returned HTTP ${response.status}.`);
    const data = await response.json();
    $("#rdap-name").textContent = data.name || "Not provided";
    $("#rdap-handle").textContent = data.handle || "Not provided";
    $("#rdap-range").textContent = data.startAddress && data.endAddress ? `${data.startAddress} – ${data.endAddress}` : "Not provided";
    $("#rdap-country").textContent = data.country || "Not provided";
    $("#rdap-type").textContent = data.type || "Not provided";
    $("#lookup-results").hidden = false;
    setFeedback(status, "Public registration data received.", "success");
  } catch (error) {
    setFeedback(status, error instanceof Error ? `${error.message} Try again later or check the service’s availability.` : "The lookup failed. Check your connection and try again.", "error");
  }
});
