/**
* @file Basic user interface management for CypherPoker.JS.
*
* @version 0.0.1
* @author Patrick Bay
* @copyright MIT License
*/

/**
* @class Basic user interface management for CypherPoker.JS
*/
class CypherPokerUI {

   //TODO: Externize this data to a JSON file or something similar so that we don't have to manage
   //all of these selectors here in the class header.

   /**
   * @property {Object} UISelectors Name/value pairs for general UI elements and their
   * associated CSS-style DOM selectors.
   * @property {String} UISelectors.dialog="#mainDialog" The main or primary dialog element.
   * @property {String} UISelectors.lobby="#lobby" The main lobby container element.
   */
   get UISelectors() {
      return({
         "dialog":"#mainDialog",
         "lobby":"#lobby"
      });
   }

   /**
   * @property {Object} lobbyUISelectors Name/value pairs for lobby UI elements and their
   * associated CSS-style DOM selectors. Note that these selectors are relative to/children of the
   * main lobby element defined in {@link CypherPokerUI#UISelectors}<code>.lobby</code>.
   * @property {String} lobbyUISelectors.createGameButton="#createGameForm>#createGameButton" The lobby's create game button.
   * @property {String} lobbyUISelectors.createPlayerAlias="#createGameForm>#playerAlias" The player alias field in the create table form.
   * @property {String} lobbyUISelectors.createTableName="#createGameForm>#tableName" The table name field in the create table form.
   * @property {String} lobbyUISelectors.createNumPlayers="#createGameForm>#numPlayers" The number of players field for the new table in the create table form.
   * @property {String} lobbyUISelectors.createBigBlind="#createGameForm>#bigBlindAmount" The big blind amount field for the new table in the create table form.
   * @property {String} lobbyUISelectors.createSmallBlind="#createGameForm>#smallBlindAmount" The big blind amount field for the new table in the create table form.
   * @property {String} lobbyUISelectors.tableList="#tableList" The lobby's announced table list.
   */
   get lobbyUISelectors() {
      return({
         "createGameButton":"#createGameForm > #createGameButton",
         "createPlayerAlias":"#createGameForm > #playerAlias",
         "createTableName":"#createGameForm > #tableName",
         "createNumPlayers":"#createGameForm > #numPlayers",
         "createBigBlind":"#createGameForm > #bigBlindAmount",
         "createSmallBlind":"#createGameForm > #smallBlindAmount",
         "tableList":"#tableList"
      });
   }

   /**
   * @property {Object} gameUISelectors Name/value pairs for game UI elements and their
   * associated CSS-style DOM selectors. Note that these selectors are relative to/children of
   * each game element cloned from the {@link CypherPokerUI#protoGameElement}.
   * @property {String} gameUISelectors.betButton="#betButton" The game's bet button.
   * @property {String} gameUISelectors.foldButton="#foldButton" The game's fold button.
   * @property {String} gameUISelectors.newHandButton="#newHandButton" The game's new hand button.
   * @property {String} gameUISelectors.totalBet="#totalBet" The game's total bet amount display element.
   * @property {String} gameUISelectors.potAmount="#potAmount" The game's pot amount input element.
   * @property {String} gameUISelectors.betAmount="#betAmount" The game's bet amount input element.
   * @property {String} gameUISelectors.publicCards="#publicCards" The game's public cards container element.
   * @property {String} gameUISelectors.privateCards="#privateCards" The game's private cards container element.
   * @property {String} gameUISelectors.handHistory="#handHistory" The game's hand history container element.
   */
   get gameUISelectors() {
      return({
         "betButton":"#betButton",
         "foldButton":"#foldButton",
         "newHandButton":"#newHandButton",
         "totalBet":"#totalBet",
         "potAmount":"#potAmount",
         "betAmount":"#betAmount",
         "publicCards":"#publicCards",
         "privateCards":"#privateCards",
         "handHistory":"#handHistory"
      });
   }

   /**
   * Creates a new instance.
   *
   * @param {HTMLElement} protoElement A reference to the prototype element that will
   * be cloned for use with each new game instance. The original element will
   * remain unchanged (it should be hidden by default).
   */
   constructor(protoElement) {
      this._protoGameElement = protoElement;
      this.addLobbyUIHandlers(document.querySelector(this.UISelectors.lobby));
   }

   /**
   * @property {Boolean} autoDeal=true If true, cards are automatically dealt when
   * betting is done and it's our turn to deal. If <code>false</code>, the
   * {@link CypherPokerGame#dealCards} function of the {@link CypherPokerUI#game}
   * reference will need to be invoked manually.
   */
   get autoDeal() {
      if (this._autoDeal == undefined) {
         this._autoDeal = true;
      }
      return (this._autoDeal);
   }

   set autoDeal(adSet) {
      this._autoDeal = adSet;
   }

   /**
   * @property {Array} gameElements An indexed array of all game container elements
   * cloned from the {@link CypherPokerUI#protoGameElement} object.
   */
   get gameElements() {
      if (this._gameElements == undefined) {
         this._gameElements = new Array();
      }
      return (this._gameElements);
   }
   /**
   * @property {HTMLElement} protoGameElement A reference to the prototype element in which
   * the game user interface is contained, as set at instantiation time. This element will be
   * cloned for each new game instance.
   * @readonly
   */
   get protoGameElement() {
      return (this._protoGameElement);
   }

   /**
   * @property {CypherPoker} cypherpoker A reference to the main {@link CypherPoker} instance.
   * This property may only be set once. When set, a number of event listeners are
   * added to the instance so that the user interface can respond to them.
   */
   set cypherpoker(cpSet) {
      if ((this._cypherpoker == undefined) || (this._cypherpoker == null)) {
         this._cypherpoker = cpSet;
         this.addCypherPokerHandlers();
         if (this._cypherpoker.connected) {
            this.showDialog("Connected to peer-to-peer network.");
            this.hideDialog(3000);
         } else {
            this._cypherpoker.addEventListener("start", event => {
               this.showDialog("Connected to peer-to-peer network.");
               this.hideDialog(3000);
            }, this);
         }
      } else {
         throw (new Error("The \"cypherpoker\" reference can only be set once."));
      }
   }

   get cypherpoker() {
      if (this._cypherpoker == undefined) {
         return (null);
      }
      return (this._cypherpoker);
   }

   /**
   * Adds lobby event listeners and callbacks to user interface elements defined in
   * {@link CypherPokerUI#lobbyUISelectors}.
   *
   * @param {HTMLElement} lobbyElement The lobby element to which to add handlers to.
   */
   addLobbyUIHandlers(lobbyElement) {
      for (var item in this.lobbyUISelectors) {
         try {
            let element = lobbyElement.querySelector(this.lobbyUISelectors[item]);
            element.ui = this;
         } catch (err) {
         }
      }
      var createGameButton = lobbyElement.querySelector(this.lobbyUISelectors.createGameButton);
      createGameButton.addEventListener("click", this.onCreateGameButtonClick, this);
   }

   /**
   * Adds game event listeners and callbacks to user interface elements defined in
   * {@link CypherPokerUI#gameUISelectors} and contained in a clone of the {@link CypherPokerUI#protoGameElement}
   * element.
   *
   * @param {HTMLElement} gameElement The cloned game element to which to add handlers to.
   * @param {CypherPokerGame} gameRef A reference to the game instance associated with the
   * game element.
   */
   addGameUIHandlers(gameElement, gameRef) {
      //add references to game and this instance to all game elements
      for (var item in this.gameUISelectors) {
         try {
            let element = gameElement.querySelector(this.gameUISelectors[item]);
            element.game = gameRef;
            element.ui = this;
         } catch (err) {
         }
      }
      //each of the following has a "game" and "ui" reference added to it
      var betButton = gameElement.querySelector(this.gameUISelectors.betButton);
      var foldButton = gameElement.querySelector(this.gameUISelectors.foldButton);
      var newHandButton = gameElement.querySelector(this.gameUISelectors.newHandButton);
      betButton.addEventListener("click", this.onBetButtonClick);
      foldButton.addEventListener("click", this.onFoldButtonClick);
      newHandButton.addEventListener("click", this.onNewHandButtonClick);
      gameRef.addEventListener("gamedeal", this.onCardDeal, this);
      gameRef.addEventListener("gamebet", this.onBetPlaced, this);
      gameRef.addEventListener("gameend", this.onGameEnd, this);
      gameRef.addEventListener("gamescored", this.onGameScored, this);
      this.disable(betButton);
   }

   /**
   * Adds event listeners and callbacks to the {@link CypherPoker} instance assigned to
   * the {@link CypherPokerUI#cypherpoker} property.
   */
   addCypherPokerHandlers() {
      this.cypherpoker.addEventListener("newgame", this.onNewGame, this);
      this.cypherpoker.addEventListener("tablenew", this.onNewTableAnnouncement, this);
      this.cypherpoker.captureNewTables = true;
   }

   /**
   * Event handler invoked when the "Create Game" button is clicked in the DOM.
   *
   * @param {Event} event A standard DOM button click event.
   */
   onCreateGameButtonClick(event) {
      var ui = event.target.ui; //this CypherPokerUI instance
      ui.disable(event.target);
      var tableInfo = new Object();
      var lobbyElement = document.querySelector(ui.UISelectors.lobby);
      var alias = lobbyElement.querySelector(ui.lobbyUISelectors.createPlayerAlias).value;
      var tableName = lobbyElement.querySelector(ui.lobbyUISelectors.createTableName).value;
      var numPlayers = Number(lobbyElement.querySelector(ui.lobbyUISelectors.createNumPlayers).value);
      numPlayers--; //exclude self
      var bigBlindAmount = lobbyElement.querySelector(ui.lobbyUISelectors.createBigBlind).value;
      var smallBlindAmount = lobbyElement.querySelector(ui.lobbyUISelectors.createSmallBlind).value;
      tableInfo.bigBlind = bigBlindAmount;
      tableInfo.smallBlind = smallBlindAmount;
      ui.cypherpoker.createTable(tableName, numPlayers, tableInfo); //create heads-up game
      ui.cypherpoker.onEventPromise("tableready").then(event =>{
         var playerInfo = new Object();
         playerInfo.alias = alias;
         ui.cypherpoker.createGame(event.table, playerInfo).start();
      })
   }

   /**
   * Function invoked when an externally advertised table button is clicked to join it.
   *
   * @param {Event} event A standard DOM button event object.
   */
   onJoinTableButtonClick(event) {
      //this event may have been triggered by a child node of the button (is there wa better way to deal with this?)
      var target = event.target;
      while (target.ui == undefined) {
         target = target.parentNode;
      }
      var ui = target.ui;
      var table = target.table;
      ui.cypherpoker.joinTable(table);
      ui.cypherpoker.onEventPromise("tableready").then(event =>{
         //use updated event.table here
         var playerInfo = new Object();
         playerInfo.alias = "A player";
         //... we can add other stuff to "playerInfo" as desired.
         ui.cypherpoker.createGame(event.table, playerInfo).start();
      }).catch(error => {
         this.showDialog(error);
         this.hideDialog(4000);
      });
   }

   /**
   * Event listener invoked when the user interface's "bet" button is clicked.
   *
   * @param {Event} event A DOM event object.
   *
   * @listens Event#click
   */
   onBetButtonClick(event) {
      var game = event.target.game;
      var ui = event.target.ui;
      ui.debug("onBetButtonClick("+event+")");
      ui.disable(event.target);
      ui.disable(game.DOMElement.querySelector(ui.gameUISelectors.betButton));
      ui.disable(game.DOMElement.querySelector(ui.gameUISelectors.foldButton));
      var betAmount = game.DOMElement.querySelector(ui.gameUISelectors.betAmount);
      try {
         game.placeBet(betAmount.value);
      } catch (err) {
         //probably wrong bet amount
         ui.enable(event.target);
      }
      game.DOMElement.querySelector(ui.gameUISelectors.potAmount).innerHTML = game.pot.toString(10);
      ui.updateTotalBet.call(ui, game);
      if (game.bettingDone && ui.autoDeal && (game.gameDone == false)) {
         //try to automatically deal cards
         game.dealCards().catch(err => {
            //not our time to deal
         });
      }
   }

   /**
   * Updates the "total bet" field in the user interface associated with a specific game.
   *
   * @param {CypherPokerGame} game The game for which to update the UI.
   */
   updateTotalBet(game) {
      var totalBetAmount = game.getPlayer(game.ownPID).totalBet.toString();
      var totalBetDiv = game.DOMElement.querySelector(this.gameUISelectors.totalBet);
      totalBetDiv.innerHTML = totalBetAmount;
   }

   /**
   * Event listener invoked when the user interface's "fold" button is clicked.
   *
   * @param {Event} event A DOM event object.
   *
   * @listens Event#click
   */
   onFoldButtonClick(event) {
      var game = event.target.game;
      var ui = event.target.ui;
      ui.debug("onFoldButtonClick("+event+")");
      ui.disable(event.target);
      ui.disable(game.DOMElement.querySelector(ui.gameUISelectors.betButton));
      try {
         game.placeBet(-1);
      } catch (err) {}
      if (game.bettingDone && ui.autoDeal && (game.gameDone == false)) {
         //try to automatically deal cards
         game.dealCards().catch(err => {
            //not our time to deal
         });
      }
   }

   /**
   * Event listener invoked when the user interface's "new hand" button is clicked.
   *
   * @param {Event} event A DOM event object.
   *
   * @listens Event#click
   */
   onNewHandButtonClick(event) {
      var ui = event.target.ui;
      var game = event.target.game;
      ui.disable(event.target);
      ui.resetGameUI(game);
      game.restartGame();
   }

   /**
   * Event listener invoked when a new table has been announced by another peer.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPoker#event:tablenew
   */
   onNewTableAnnouncement(event) {
      var tableData = event.data.result.data;
      var newTableButton = document.createElement("button");
      newTableButton.setAttribute("class", "joinTableButton");
      var buttonDescriptionHTML = "<span class=\"tableName\">"+tableData.tableName+"</span><br/>"
      buttonDescriptionHTML += "<span class=\"numPlayers\"><small>Number of players: "+(tableData.requiredPID.length+1)+"</small></span><br/>";
      buttonDescriptionHTML += "<span class=\"bigBlindAmount\"><small>Big blind: "+tableData.tableInfo.bigBlind+"</small></span><br/>";
      buttonDescriptionHTML += "<span class=\"smallBlindAmount\"><small>Small blind: "+tableData.tableInfo.smallBlind+"</small></span>";
      newTableButton.innerHTML = buttonDescriptionHTML;
      var containerElement = document.querySelector(this.lobbyUISelectors.tableList);
      var joinTableButton = containerElement.appendChild(newTableButton);
      joinTableButton.table = this.cypherpoker.announcedTables[0]; //newest table reference
      joinTableButton.ui = this;
      joinTableButton.addEventListener("click", this.onJoinTableButtonClick);
   }

   /**
   * Event listener invoked when the associated {@link CypherPoker} instance
   * dispatches a {@link CypherPoker#event:newgame} event.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPoker#newgame
   */
   onNewGame(event) {
      var newGameElement = this._protoGameElement.insertAdjacentElement("beforebegin", this._protoGameElement.cloneNode(true));
      var namePrefix = newGameElement.getAttribute("name");
      if ((namePrefix == null) || (namePrefix == "")) {
         namePrefix = newGameElement.getAttribute("id");
      }
      if ((namePrefix == null) || (namePrefix == "")) {
         namePrefix = "game";
      }
      var elementName = namePrefix + String(this.gameElements.length + 1);
      newGameElement.setAttribute("name", elementName)
      this.gameElements.push(newGameElement);
      event.game.DOMElement = newGameElement;
      this.addGameUIHandlers(newGameElement, event.game);
      var lobbyElement = document.querySelector(this.UISelectors.lobby);
      this.hide(lobbyElement);
      this.show(newGameElement);
   }

   /**
   * Event handler invoked when an associated game instance reports that new cards
   * have been dealt.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPokerGame#event:gamedeal
   */
   onCardDeal(event) {
      var game = event.game;
      var targetElement = game.DOMElement.querySelector(ui.gameUISelectors.privateCards);
      if (event.private == false) {
         targetElement = game.DOMElement.querySelector(ui.gameUISelectors.publicCards);
      }
      for (var count=0; count < event.cards.length; count++) {
         event.cards[count].addToDOM(targetElement);
      }
      //pot may have changed if we've auto-posted blinds
      game.DOMElement.querySelector(this.gameUISelectors.potAmount).innerHTML = game.pot.toString();
      if (game.canBet) {
         this.updateMinimumBet(game);
         this.enable(game.DOMElement.querySelector(this.gameUISelectors.betButton));
         this.enable(game.DOMElement.querySelector(this.gameUISelectors.foldButton));
      }
      this.updateTotalBet(game);
   }

   /**
   * Updates the game user interface with the minimum allowable bet for the current round of
   * betting.
   *
   * @param {CypherPokerGame} gameRef The game instance for which to update the user interface.
   */
   updateMinimumBet(gameRef) {
      var betAmountElement = gameRef.DOMElement.querySelector(this.gameUISelectors.betAmount);
      betAmountElement.value = gameRef.minimumBet.toString();
   }

   /**
   * Event handler invoked when an associated game instance reports that a new bet
   * has been placed by another player.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPokerGame#event:gamebet
   */
   onBetPlaced(event) {
      var game = event.game;
      this.debug("onBetPlaced()");
      game.DOMElement.querySelector(this.gameUISelectors.potAmount).innerHTML = game.pot.toString();
      this.updateTotalBet(game);
      if (game.canBet) {
         this.updateMinimumBet(game);
         this.enable(game.DOMElement.querySelector(this.gameUISelectors.betButton));
         this.enable(game.DOMElement.querySelector(this.gameUISelectors.foldButton));
      }
      if (game.bettingDone && this.autoDeal && (game.gameDone == false)) {
         //try to automatically deal cards
         game.dealCards().catch(err => {
            //not our time to deal
         });
      }
   }

   /**
   * Event handler invoked when an associated game instance reports that it has ended.
   * In other words, the game (hand) has completed.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPokerGame#event:gameend
   * @async
   */
   async onGameEnd(event) {
      this.showDialog("Game is done!");
      var game = event.game;
      var table = event.table;
      this.disable(game.DOMElement.querySelector(this.gameUISelectors.betButton));
      this.disable(game.DOMElement.querySelector(this.gameUISelectors.foldButton));
      if (game.getNextPlayer(game.getDealer().privateID).privateID == game.ownPID) {
         //if we want to auto-restart we should do that below
         this.enable(game.DOMElement.querySelector(this.gameUISelectors.newHandButton));
      } else {
         this.resetGameUI(game);
         game.restartGame();
      }
   }

   /**
   * Event handler invoked when an associated game instance reports that it has been
   * scored.
   *
   * @param {Event} event An event object.
   *
   * @listens CypherPokerGame#event:gamescored
   */
   onGameScored(event) {
      this.debug("CypherPokerUI.onGameScored("+event+")");
      try {
         var analysis = event.analyzer.analysis;
         var allHands = analysis.hands;
         var winningHands = analysis.winningHands;
         var winningPlayers = analysis.winningPlayers;
         var historyHTML = document.createElement("div");
         historyHTML.setAttribute("class", "handHistoryItemContainer");
         var headerElement = document.createElement("span");
         headerElement.setAttribute("class", "handHistoryItemHeader");
         if (winningHands.length > 1) {
            headerElement.innerHTML = "Best Hands<br/>";
         } else {
            headerElement.innerHTML = "Best Hand<br/>";
         }
         for (var count = 0; count < winningHands.length; count++) {
            var winningHand = winningHands[count];
            var winningPlayer = winningPlayers[count];
            var hand = winningHand.hand;
            headerElement.innerHTML += "<span class=\"historyHandName\">"+winningHand.name+"</span><br/>";
            if (winningPlayer.privateID == event.game.ownPID) {
               headerElement.innerHTML += "<span class=\"historyHandOwner\">Ours</span><br/>";
            } else {
               headerElement.innerHTML += "<span class=\"historyHandOwner\">Player: "+winningPlayer.privateID+"</span><br/>";
            }
            var cardContainerElement = document.createElement("div");
            cardContainerElement.setAttribute("class", "handHistoryItemCards");
            for (var count2 = 0; count2 < hand.length; count2++) {
               var card = hand[count2];
               card.addToDOM(cardContainerElement, "historyCard");
            }
         }
         historyHTML.appendChild(headerElement);
         historyHTML.appendChild(cardContainerElement);
         var targetElement = event.game.DOMElement.querySelector(this.gameUISelectors.handHistory);
         targetElement.appendChild(historyHTML);
      } catch (err) {
         console.error(err);
      }
   }

   /**
   * Resets the game UI for a new game (hand) with an optional delay.
   *
   * @param {CypherPokerGame} gameRef A reference to the game containing the
   * <code>DOMElement</code> to clear.
   * @param {Number} [delay=0] A pause, in milliseconds, to wait before
   * resetting the game UI.
   * @param {CypherPokerUI} [context=null] The UI context in which to execute the
   * delayed function. If <code>null</code>, the context resolves to <code>this</code>
   *
   */
   resetGameUI(gameRef, delay=0, context=null) {
      if (context == null) {
         context = this;
      }
      context.debug("resetGameUI("+gameRef+", "+delay+", "+context+")");
      if (delay > 0) {
         setTimeout(context.resetGameUI, delay, gameRef, 0, context);
      }
      context.hideDialog.call(context, 3000);
      gameRef.DOMElement.querySelector(context.gameUISelectors.publicCards).innerHTML = "";
      gameRef.DOMElement.querySelector(context.gameUISelectors.privateCards).innerHTML = "";
      gameRef.DOMElement.querySelector(context.gameUISelectors.totalBet).value = "0";
   }

   /**
   * Disables a specific HTML element by adding a <code>disabled="true"</code>
   * attribute to it.
   *
   * @param {HTMLElement} elementRef A reference to the object to disable.
   */
   disable(elementRef) {
      elementRef.setAttribute("disabled", true);
   }

   /**
   * Enables a specific HTML element by removing the <code>disabled</code>
   * attribute from it.
   *
   * @param {HTMLElement} elementRef A reference to the object to enable.
   */
   enable(elementRef) {
      elementRef.removeAttribute("disabled");
   }

   /**
   * Hides a specific HTML element by adding a <code>hidden="true"</code>
   * attribute to it.
   *
   * @param {HTMLElement} elementRef A reference to the object to hide.
   */
   hide(elementRef) {
      elementRef.setAttribute("hidden", true);
   }

   /**
   * Shows a specific HTML element by removing the <code>hidden</code>
   * attribute from it.
   *
   * @param {HTMLElement} elementRef A reference to the object to show.
   */
   show(elementRef) {
      elementRef.removeAttribute("hidden");
   }

   /**
   * Hides the main dialog, as defined in {@link CypherPokerUI#UISelectors}<code>.dialog</code>,
   * with an optional delay.
   *
   * @param {Number} [delay=0] The number of milliseconds to delay before closing the
   * dialog.
   * @param {CypherPokerUI} [context=null] A reference to this instance, used in
   * conjunction with the hide delay. If <code>null</code>, <code>this</code> is
   * used as the default context.
   */
   hideDialog(delay=0, context=null) {
      if (delay > 0) {
         setTimeout(this.hideDialog, delay, 0, this);
         return;
      }
      if (context == null) {
         var dialog = document.querySelector(this.UISelectors.dialog);
      } else {
         dialog = document.querySelector(context.UISelectors.dialog);
      }
      dialog.removeAttribute("open");
   }

   /**
   * Displays the main dialog with specified contents
   *
   * @param {String} content The HTML contents to display in the dialog.
   */
   showDialog(contents) {
      var dialog = document.querySelector(this.UISelectors.dialog);
      dialog.setAttribute("open", true);
      dialog.innerHTML = contents;
   }

   /**
   * Creates a <code>console</code>-based.
   *
   * @param {*} msg The message to send to the console output.
   * @param {String} [type="log"] The type of output that the <code>msg</code> should
   * be sent to. Valid values are "log" - send to the standard <code>log</code> output,
   * "err" or "error" - send to the <code>error</code> output, and "dir"-send to the
   * <code>dir</code> (object inspection) output.
   * @private
   */
   debug (msg, type="log") {
      if ((type == "err") || (type == "error")) {
         console.error(msg);
      } else if (type == "dir") {
         console.dir(msg);
      } else {
         console.log(msg);
      }
   }

   /**
   * @private
   */
   toString() {
      return ("[object CypherPokerUI]");
   }
}
