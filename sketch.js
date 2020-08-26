var dog;
var dogSprite;
var happyDog;
var food;
var foodStock;
var database;
var feedButton;
var addFoodButton;
var fedTime,lastFed;
var foodObj;

function preload()
{
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/happydogImg.png");
}

function setup() 
{
	createCanvas(1000, 500);
  database = firebase.database();

  dogSprite = createSprite(250,350,25,25);
  dogSprite.addImage(dog);
  dogSprite.scale = 0.25;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  ground = createSprite(100,485,1700,100);
  ground.shapeColor = "darkred";

  foodObj = new Food();

  feedButton = createButton("Feed your dog");
  feedButton.position(600,95);
  feedButton.mousePressed(feedDog);

  addFoodButton = createButton("Add Food");
  addFoodButton.position(700,95);
  addFoodButton.mousePressed(addFood)
}


function draw() 
{  
  background("white")

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed = data.val();
  });

  textSize(15);
  fill("black");
  
  if(lastFed >= 12)
  {
    text("LastFed : " + lastFed % 12 + " PM", 350, 30);
  }
  else if(lastFed === 0)
  {
    text("LastFed : 12PM", 350, 30);
  }
  else
  {
    text("LastFed : " + lastFed+ " AM", 350, 30);
  }

  drawSprites();

  text("FoodStock :" + food, 100, 250);
}

function addFood()
{
  food++;
  database.ref('/').update(
  {
    Food:food
  })
}

function feedDog()
{
  dogSprite.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update(
  {
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function readStock(data)
{
  food = data.val();
  foodObj.updateFoodStock(food);
}

function writeStock(x)
{
  if(x <= 0)
  {
    x = 0;
  }
  else
  {
    x = x-1;
  }

  database.ref('/').update
  (
   {
     Food : x
   }
  )
}
