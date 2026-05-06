class Animal:

    
    name = ""
    age=""
    
    def eat(self):
        print("I can eat")
        print("I can run")
        print("I can bark")
class Dog(Animal):

    
    def display(self):
        
        
        print("My name is ", self.name)
        print(self.age)


labrador = Dog()


labrador.name = "Rocky"
labrador.age ="4"
labrador.eat()


labrador.display()

