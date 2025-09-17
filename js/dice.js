class Dice {
  constructor(ndice, nsides = 6) {
    this.ndice = ndice;
    this.nsides = nsides;
    this.noutcomes = (ndice * nsides) - ndice + 1;
    this.counts = new Array(this.noutcomes).fill(0);
    this.rolls = 0;
  }

  reset() {
    this.counts.fill(0);
    this.rolls = 0;
  }

  roll(nrolls = 1) {
    if (nrolls < 0) {
      this.reset();
      return this;
    }

    for (let n = 0; n < nrolls; n++) {
      let sum = 0;
      for (let d = 0; d < this.ndice; d++) {
        sum += Math.floor(this.nsides * Math.random());
      }
      this.counts[sum] += 1;
      this.rolls += 1;
    }

    return this;
  }

  draw(graphEl) {
    const countEl = graphEl.parentElement.querySelector(".counter") ?? null;
    const axisEl = graphEl.parentElement.querySelector(".axis") ?? null;

    graphEl.innerHTML = "";
    axisEl.innerHTML = "";

    const max = Math.max(...this.counts);

    const styleClasses = [];

    if (this.counts.length > 70 || this.rolls < 1) {
      styleClasses.push("hide");
    } else if (this.counts.length > 35) {
      styleClasses.push("small");
    }

    for (let i = 0; i < this.counts.length; i++) {
      const mbar = document.createElement("div");
      const mtick = document.createElement("div");

      const barHeight = this.counts[i] / max;
      mbar.classList.add(...styleClasses, "bar");
      mtick.classList.add(...styleClasses, "tick");

      mbar.dataset.x = i;
      mbar.style.height = `${barHeight * 100}%`;

      mbar.innerHTML = this.counts[i];
      mtick.innerHTML = `${i + this.ndice}`;

      if (barHeight < 0.1) {
        mbar.classList.add("tiny");
        mtick.classList.add("tiny");
      }

      graphEl.appendChild(mbar);
      axisEl.appendChild(mtick);
    }

    if (countEl) {
      countEl.innerHTML = `${this.rolls}`;
    }
  }
}

window.addEventListener("load", () => {
  const diceRolls = Array.from(document.getElementsByClassName("dice-roll"));
  const diceChanges = Array.from(document.getElementsByClassName("dice-change"));
  const resetDice = Array.from(document.querySelectorAll(".dice-roll[data-rolls='-1']"));

  const MY_DICE = [1, 2, 3].map(x => new Dice(x));

  diceRolls.forEach((el) => el.addEventListener("click", (evt) => {
    const el = evt.target;
    const sectionEl = el.closest("section");
    const graphEl = sectionEl.querySelector(".graph");
    const idx = parseInt(sectionEl.dataset.diceSectionIdx);
    const rolls = parseInt(el.dataset.rolls);

    MY_DICE[idx].roll(rolls).draw(graphEl);
  }));

  diceChanges.forEach((el) => el.addEventListener("click", (evt) => {
    const el = evt.target;
    const sectionEl = el.closest("section");
    const graphEl = sectionEl.querySelector(".graph");
    const diceEl = sectionEl.querySelector(".dice-count");

    const idx = parseInt(sectionEl.dataset.diceSectionIdx);
    const dice = parseInt(el.dataset.dice);
    const rolls = MY_DICE[idx].rolls;

    diceEl.innerHTML = `${dice}`;

    MY_DICE[idx] = new Dice(dice);
    MY_DICE[idx].roll(rolls).draw(graphEl);
  }));

  resetDice.forEach((el) => el.click());
});
