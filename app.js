new Vue({
  el: "app",
  data: {
    playerMaxHealth: 100,
    playerHealth: 0,
    playerMaxMana: 3,
    playerMana: 0,
    monsterMaxHealth: 120,
    monsterHealth: 0,
    gameIsRunning: false,
    turns: []
  },
  computed: {
    playerHealthIndicator: function() {
      return (this.playerHealth / this.playerMaxHealth) * 100;
    },
    playerManaIndicator: function() {
      return (this.playerMana / this.playerMaxMana) * 100;
    },
    monsterHealthIndicator: function() {
      return (this.monsterHealth / this.monsterMaxHealth) * 100;
    }
  },
  methods: {
    startGame: function() {
      this.gameIsRunning = true;
      this.playerHealth = this.playerMaxHealth;
      this.playerMana = this.playerMaxMana;
      this.monsterHealth = this.monsterMaxHealth;
      this.turns = [];
    },
    attack: function() {
      var damage = this.calculateDamage(5, 15);
      this.monsterHealth -= damage;
      this.turns.unshift({
        isPlayer: true,
        text: "O seu ataque causou " + damage + " de dano."
      });

      if (this.checkWin()) {
        return;
      }

      this.endPlayerPhase();
    },
    specialAttack: function() {
      var damage = this.calculateDamage(10, 25);
      if (this.playerMana >= 3) {
        this.monsterHealth -= damage;
        this.playerMana -= 3;
        this.turns.unshift({
          isPlayer: true,
          text: "O seu ataque especial causou " + damage + " de dano."
        });
      }

      if (this.checkWin()) {
        return;
      }

      this.endPlayerPhase();
    },
    heal: function() {
      if (this.playerMana >= 2) {
        var healPoints = this.calculateDamage(10, 25);
        if (healPoints + this.playerHealth > this.playerMaxHealth) {
          this.playerHealth = this.playerMaxHealth;
        } else {
          this.playerHealth += healPoints;
        }
        this.turns.unshift({
          isPlayer: true,
          text: "Você curou " + healPoints + " de vida."
        });
        this.playerMana -= 2;
      }

      if (this.checkWin()) {
        return;
      }

      this.endPlayerPhase();
    },
    giveUp: function() {
      this.playerHealth = 0;
      this.playerMana = 0;
      this.monsterHealth = 0;
      this.gameIsRunning = false;
      this.turns = [];
    },
    monsterAttack: function() {
      var damage = this.calculateDamage(7, 20);
      this.turns.unshift({
        isPlayer: false,
        text: "O ataque do monstro causou " + damage + " de dano."
      });
      this.playerHealth -= damage;
    },
    calculateDamage(min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    endPlayerPhase: function() {
      // setTimeout(() => {
      //   this.monsterAttack()
      // }, 2000)
      this.monsterAttack();
      this.checkWin();
      if (this.playerMana < 3) {
        this.playerMana++;
      }
    },
    checkWin: function() {
      if (this.monsterHealth <= 0) {
        if (confirm("Você ganhou! Novo Jogo?")) {
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      } else if (this.playerHealth <= 0) {
        if (confirm("Você perdeu! Novo Jogo?")) {
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      }
      return false;
    }
  }
});
