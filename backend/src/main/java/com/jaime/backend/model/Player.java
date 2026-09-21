package com.jaime.backend.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int edad;
    private int dorsal;
    private String posicion;

    public Player() {

    }
    public Player(Long id, String nombre, int edad, int dorsal, String posicion){
            this.id = id;
            this.nombre = nombre;
            this.dorsal = dorsal;
            this.edad = edad;
            this.posicion = posicion;

        }




    public Long getId(){
        return  id;
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



    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public void setDorsal(int dorsal) {
        this.dorsal = dorsal;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

}
