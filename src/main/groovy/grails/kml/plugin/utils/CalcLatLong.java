package grails.kml.plugin.utils;

import groovy.transform.CompileStatic;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Math.*;

@CompileStatic
public class CalcLatLong {

	public Map<String, Double> parse(double radius, double lon, double lat) {
		double latmin = lat -(radius/69);
		double latmax = lat +(radius/69);
		double lonmin = lon - radius/abs(cos(deg2rad(lat))*69);
		double lonmax = lon + radius/abs(cos(deg2rad(lat))*69);

		Map<String, Double> values = new HashMap<String, Double>();
		values.put("latmin", latmin);
		values.put("latmax", latmax);
		values.put("lonmin", lonmin);
		values.put("lonmax", lonmax);
		return values;
	}

	private double deg2rad(double deg) {
		return (deg * PI / 180.0);
	}
}
