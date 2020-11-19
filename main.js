$(document).ready(function () {

    // Amination för startDiv
    $(".backgroundBlock").hide();
    $("<button>").appendTo(".startDiv").html("Let's go!").on("click", function(){
        $(".startDiv").slideUp("slow", function(){

        });
        setTimeout(function(){
            $(".backgroundBlock").show();
            timer();
        }, 50);
        
    });
    
    // Gör så att inputfältet är markerat direkt vid sidladdning
    $("#inputField").focus();
    
    // Man kan trycka in sina commands med Enter
    let input = $("#inputField");
    input.on("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#inputBtn").click();
            input.val("");
        }
    });

    // Kaninobjekt
    function rabbit(name) {
        this.name = name;
        this.hunger = Math.floor(Math.random() * 50 + 5);
        this.alive = function () {
            return (this.hunger < 100);
        };
    }

    // Skapa kaninerna
    let rabbit1 = new rabbit("Teeko");
    let rabbit2 = new rabbit("BunBun");
    let rabbit3 = new rabbit("Buggzy");

    // Lägg till alla kaninerna i en array
    let rabbits = [rabbit1, rabbit2, rabbit3];

    // Värld 1 = Hemma
    // Random på hur mycket mat som man har hemma
    let foodQuantity = Math.floor(Math.random() * 500 + 300);
    let home = {animals: rabbits, rabbitFood: foodQuantity, name: "Home"};
    console.log(home);

    let currentWorld = home;
        
    // Värld 2 = Shop
    // Hur mycket kaninmat som finns inne i butiken
    let shopFoodQuantity = 10000;
    let shop = {rabbitFood: shopFoodQuantity, name: "Shop"};

    // Spelaren och dess egenskaper
    let currentPlayer = {strenght: 500, currentLoad: 0};

    // Uppdatera sidan med kaninernas info
    function updateRabbits() {
        // Töm diven 
        $("#RabbitsDiv").html("");
        $(".foodLevel").html(foodQuantity + "g");
        $(".position").html("You are here: " + currentWorld.name);
        let calculatedFoodQuantity = foodQuantity / 10;
        if (calculatedFoodQuantity > 100){
            calculatedFoodQuantity = 100;
        }
        $(".foodLevel").css("width", calculatedFoodQuantity + "%");

        // Visar vikten på kaninmaten som spelaren bär på.
        if (currentPlayer.currentLoad == 0){
            $(".carry").html("");
        }else{
            $(".carry").html("You are carrying " + currentPlayer.currentLoad + "g.");
        }
        
        // Loopa igenom kaninerna 
        $.each(rabbits, function (index, rabbit) {
            let div = $("<div>").text(rabbit.name + " is this hungry " + rabbit.hunger + "%");

            div.appendTo("#RabbitsDiv");
            if (!rabbit.alive()) {
                div.text("You killed " + rabbit.name + " you bastard!").addClass("deadRabbit").appendTo("#RabbitsDiv");
            }
        });
    }

    // Anropa timern en gång så att det visas på sidan
    

    // Skapa timer för hur snabbt kaninerna blir hungriga. 
    function timer() {
        let rabbitsAliveCounter = 0;

        $.each(rabbits, function (index, rabbit) {
            if (rabbit.alive()) {
                rabbit.hunger++;
                rabbitsAliveCounter++;
            }
        });
        console.log("Rabbits life: " + rabbitsAliveCounter);

        // Uppdatera sidan
        updateRabbits();

        if (rabbitsAliveCounter > 0) {
            // Skapa timeout som anropar denna function
            setTimeout(() => {
                timer();

            }, 2500);
        } else{
            $("<div>").addClass("endingDiv").html("You killed all the rabbits you damn bastard! <br> <br> You should never own a pet...").appendTo("body");
            $("<button>").addClass("reloadBtn").appendTo(".endingDiv").html("Try again").on("click", function(){
                location.reload();
            });
        }
    }

    // Förökande kaniner
    // if (rabbitsAliveCounter = 0 ){
        
    // }else{
    //     setTimeout(() => {
    //         let babyRabbit = new rabbit("Kesso");
    //         rabbits.push(babyRabbit);
    //         alert("Congratulations! A new baby rabbit! It's name is: " + babyRabbit.name)
    //     }, 6000);
    // }
    


    $("#inputBtn").click(function () {
        let command = $("#inputField").val();    // Feed Buggzy
        let commands = command.trim().split(" ");   // Comands[0] = feed     Comands[1] = Buggzy

        let oldCommandLog = $(".pastCommands").html();
        
        let newCommandLog = "You said: " + command + "<br>" + oldCommandLog;

        $(".pastCommands").html(newCommandLog);

        if (commands[0].toLowerCase() == "feed"){
            if (currentWorld !== home){
                alert("Go home to feed your rabbits.");
                return false;
            }

            $.each(rabbits, function (index, rabbit) {
                if (rabbit.name.toLowerCase() == commands[1].toLowerCase()) {
    
                    if (rabbit.hunger < 100) {
                        rabbit.hunger = rabbit.hunger - 50;
                        foodQuantity = foodQuantity - 50;
                        console.log(foodQuantity);
                        
                        if (rabbit.hunger < 0) {
                            rabbit.hunger = 0;
                        }
                        if (foodQuantity < 0 ){
                            foodQuantity = 0;
                        }
                        updateRabbits();
                        return false;
                    }  
                }
            });

        } else if (commands[0].toLowerCase() == "go" && commands[1] == "to" && commands[2].toLowerCase() == "shop"){
            // Spelaren är i butiken
            currentWorld = shop;
            updateRabbits();
        } else if (commands[0] == "go" && commands[1] == "home"){
            // Spelaren har kommit hem
            currentWorld = home;
            // Spelarens köpta kaninmat går in i lagret
            foodQuantity = foodQuantity + currentPlayer.currentLoad;
            // Återställer spelarens mängd att kunna bära
            currentPlayer.currentLoad = 0;
            updateRabbits();
        } else if(commands[0].toLowerCase() == "buy" && commands[1] == "rabbitfood" && currentWorld === shop){
            currentPlayer.currentLoad = currentPlayer.currentLoad + 250;
            if (currentPlayer.currentLoad > 500){
                currentPlayer.currentLoad = 500;
                alert("You cannot carry more than 500g, go home and feed your rabbits before they starve.");
            }
            updateRabbits();
        }else{
            alert("I could not understand your command.");
        }
        
    });












});

