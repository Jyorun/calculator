"use strict";
let current = "0";
let stored = null;
let operator = null;
let fresh = false;
let expression = "İşlem yapmaya başlayın";
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const quips = ["Kurbağa onayından geçti. 🐸", "Matematik: 1, panik: 0.", "Bu sonuç bayağı zıpladı!", "Kurbağa bunu kafadan yaptı.", "Hesap tamam, kahve molası.", "Sayılar bugün uslu duruyor."];
const vampireQuips = ["Kontes sonucu onayladı. 🧛‍♀️", "Bu hesap gece yarısı kadar keskin.", "Sonuç kan gibi net.", "Vampir bile bu işlemi kafadan yaptı.", "Hesap tamam, şimdi ay ışığı molası.", "Sayılar bu gece itaat ediyor."];
const memeQuips = ["POV: Hesap doğru çıktı. 😎", "Bros, bu sonuç bussin'.", "Matematikçiler bunu görünce: stonks 📈", "Skill issue yok, sonuç var.", "Bu hesap tam bir plot twist.", "Sayılar bu gece itaat ediyor."];
const secretKeys = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let keyTrail = [];
let wordTrail = "";
let frogTaps = 0;
let eggTimer;
function revealEgg(message) {
  const egg = document.getElementById("easter-egg");
  egg.textContent = message;
  egg.hidden = false;
  clearTimeout(eggTimer);
  eggTimer = setTimeout(() => { egg.hidden = true; }, 3500);
}
const format = value => String(value).replace(".", ",");
function render() {
  document.getElementById("result").textContent = format(current);
  document.getElementById("expression").textContent = expression;
}
function clear() {
  current = "0"; stored = null; operator = null; fresh = false;
  expression = "İşlem yapmaya başlayın";
}
function calculate(a, b, op) {
  if (op === "/" && b === 0) throw new Error("Sıfıra bölünemez");
  const value = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
  if (!Number.isFinite(value)) throw new Error("Sonuç çok büyük");
  return String(Number(value.toPrecision(12)));
}
function input(action, value) {
  if (current === "Hata" && action !== "clear") clear();
  try {
    if (action === "clear") clear();
    if (action === "digit") {
      if (fresh) { current = "0"; fresh = false; if (!operator) expression = ""; }
      if (current.replace(/[-.]/g, "").length < 12) current = current === "0" ? value : current + value;
    }
    if (action === "decimal") {
      if (fresh) { current = "0"; fresh = false; if (!operator) expression = ""; }
      if (!current.includes(".")) current += ".";
    }
    if (action === "sign" && Number(current) !== 0) current = String(-Number(current));
    if (action === "percent") current = String(Number((Number(current) / 100).toPrecision(12)));
    if (action === "backspace" && !fresh) current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
    if (action === "operator") {
      if (operator && !fresh) current = calculate(stored, Number(current), operator);
      stored = Number(current); operator = value; fresh = true;
      expression = `${format(current)} ${symbols[operator]}`;
    }
    if (action === "equals" && operator) {
      expression = `${format(stored)} ${symbols[operator]} ${format(current)} =`;
      current = calculate(stored, Number(current), operator);
      stored = null; operator = null; fresh = true;
      const activeQuips = document.body.classList.contains("meme") ? memeQuips : document.body.classList.contains("gothic") ? vampireQuips : quips;
      document.getElementById("quip").textContent = activeQuips[Math.floor(Math.random() * activeQuips.length)];
      const answer = Number(current);
      if (answer === 42) revealEgg(document.body.classList.contains("gothic") ? "42! Kontes yaşamın anlamını biliyor. 🧛‍♀️" : "42! Kurbağanın yaşamın anlamı da buydu. 🐸");
      else if (answer === 404) revealEgg("404: espri bulunamadı… şaka, burada! 😄");
      else if (answer === 1337) revealEgg(document.body.classList.contains("gothic") ? "Leet seviye açıldı. Kontes artık hacker." : "Leet seviye açıldı. Kurbağa artık hacker.");
    }
  } catch (error) {
    expression = error.message; current = "Hata"; stored = null; operator = null; fresh = true;
    document.getElementById("quip").textContent = document.body.classList.contains("meme") ? "Sıfıra bölmek? Bro fell off. 💀" : document.body.classList.contains("gothic") ? "Kontes sıfıra bölmeyi yasakladı. 🧛‍♀️" : "Kurbağa bile sıfıra bölemedi. 🐸";
  }
  render();
}
document.querySelector(".keys").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.digit !== undefined) input("digit", button.dataset.digit);
  else if (button.dataset.operator) input("operator", button.dataset.operator);
  else input(button.dataset.action);
});
document.querySelector(".badge").addEventListener("click", () => {
  frogTaps++;
  if (frogTaps >= 5) {
    frogTaps = 0;
    revealEgg("Gizli kurbağa tokalaşması! 🐸🐸");
  }
});
document.querySelector(".badge").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
  }
});
document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key;
  if (key.length === 1 && /^[a-z]$/i.test(key)) {
    wordTrail = (wordTrail + key.toLowerCase()).slice(-4);
    if (wordTrail === "goth") {
      document.body.classList.toggle("gothic");
      const mascot = document.querySelector("#mascot");
      const gothic = document.body.classList.contains("gothic");
      mascot.src = gothic ? "vampire.svg" : "frog.svg";
      mascot.alt = gothic ? "Dişi vampir maskotu" : "Kurbağa maskotu";
      document.querySelector("#brand-subtitle").textContent = gothic ? "Kontes bile hesaplıyor." : "Kurbağa bile hesaplıyor.";
      revealEgg(document.body.classList.contains("gothic") ? "Gece çöktü… gotik mod açıldı. 🦇" : "Şafak söktü. Kurbağa geri döndü. 🐸");
      wordTrail = "";
    }
    if (wordTrail === "meme") {
      document.body.classList.toggle("meme");
      document.body.classList.remove("gothic");
      const memeMode = document.body.classList.contains("meme");
      const mascot = document.querySelector("#mascot");
      mascot.src = memeMode ? "meme.svg" : "frog.svg";
      mascot.alt = memeMode ? "Meme maskotu" : "Kurbağa maskotu";
      document.querySelector("#brand-subtitle").textContent = memeMode ? "İnternet şakalarıyla hesaplıyor." : "Kurbağa bile hesaplıyor.";
      revealEgg(memeMode ? "Meme modu açıldı. Bu hesap viral olacak. 😂" : "Meme modu kapandı. 🐸");
      wordTrail = "";
    }
  } else if (key.length !== 1 || !/^[a-z]$/i.test(key)) wordTrail = "";
  keyTrail.push(key.length === 1 ? key.toLowerCase() : key);
  keyTrail = keyTrail.slice(-secretKeys.length);
  if (secretKeys.every((secret, i) => keyTrail[i] === secret)) {
    keyTrail = [];
    revealEgg("Kurbağa modu açıldı! Zıpla zıpla! 🐸✨");
  }
  if (/^[0-9]$/.test(key)) input("digit", key);
  else if (["+", "-", "*", "/"].includes(key)) input("operator", key);
  else if (key === "." || key === ",") input("decimal");
  else if (key === "Enter" || key === "=") input("equals");
  else if (key === "Escape" || key === "Delete") input("clear");
  else if (key === "Backspace") input("backspace");
  else if (key === "%") input("percent");
  else return;
  event.preventDefault();
});

