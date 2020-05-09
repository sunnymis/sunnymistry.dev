---
title: TypeScript Does Not Exist
date: "2020-05-09"
template: "post"
draft: false
slug: "typescript-does-not-exist"
tags:
  - "Typescript"
description: "Typescript does not exist"
socialImage: "/profile-photo.jpg"
---

type Color = 'black' | 'white';

enum Direction {
    Straight,
    Diagonal,
    L
}

interface Coordinate {
    row: number;
    column: number;
}

// abstract would not show
abstract class Piece {
    private readonly color: Color;
    private readonly position: Coordinate;

    constructor(color: Color, startPosition: Coordinate) {
        this.color = color;
        this.position = startPosition;
    }

    getPosition():Coordinate {
        return {
            row: this.position.row,
            column: this.position.column
        }
    }

    abstract moveDirections(): Direction[];
}

class King extends Piece {
    constructor(color: Color, startPosition: Coordinate) {
        super(color, startPosition);
    }

    moveDirections() {
        return [Direction.Straight, Direction.Diagonal]
    }
}

let position:Coordinate = { row: 10, column: 10 }
let piece = new King('black', position)

console.log(piece.getPosition());
console.log(piece.moveDirections());



function filt<T>(arr: T[], func: (item: T) => boolean): T[] {
    let filteredItems: T[] = [];

    for (let i = 0; i < arr.length; i++) {
        if (func(arr[i])) { filteredItems.push(arr[i]); }
    }

    return filteredItems;
}

console.log(filt([1, 2, 3], (el) => el <= 2));



type Filter<T> = (arr: T[], func: (item: T) => boolean) => T;




enum Muscle {
    Bicep,
    Tricep,
    Deltoids,
    Quadriceps,
    Lats,
    Glutes
}


abstract class BodyPart {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
    abstract muscles(): Muscle[]
}

class Arm extends BodyPart {
    muscles() { 
        return [Muscle.Bicep, Muscle.Bicep]
    }
}

interface Exercise {
    name: string;
    muscle: Muscle[];
    bodyParts: BodyPart[];
    reps: number;
    weight: number;
}

function getArmExercises(exercises: Exercise[]): Exercise[] {
    return exercises.filter(e => e.muscle.includes(Muscle.Bicep))
}
