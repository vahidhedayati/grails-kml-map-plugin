package org.grails.plugins.kml.utils

import groovy.transform.CompileStatic

@CompileStatic
public enum LoadMapTypes {
    MAP((byte)0),
    USERS((byte)1),
    MAP_USERS((byte)2),


    byte value

    LoadMapTypes(byte val) {
        this.value = val
    }
    public byte getValue(){
        return value
    }
    static LoadMapTypes byValue(byte val) {
        values().find { it.value == val }
    }
}

