package com.jaime.backend.model;

public class Player {
    private String nombre;
    private int edad;
    private int dorsal;
    private String posicion;

    public Player(String nombre, int edad, int dorsal, String posicion){
        this.nombre = nombre;
        this.dorsal = dorsal;
        this.edad = edad;
        this.posicion = posicion;

    }

    public String getNombre(){
        return nombre;
    }

    public int getEdad() {
        return edad;
    }

    public int getDorsal() {
        return dorsal;
    }
    public String getPosicion(){
        return posicion;
    }
}
