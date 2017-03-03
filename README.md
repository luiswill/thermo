PROJECT NAME
----------------------
 Thermo app


DESCRIPTION
------------------------

This project simulates a thermometer for your home.

You can change the temperature whenever you want (but you must be logged in as an admin to do so).
The maximum temperature is 40°C, the minimum 0°C.
You can also switch between the value in °C to °F, but if you re-change the temp, it will be shown in Celsius again.

Temperature changes are saved in a csv file.

The outside temperature is displayed in a little window, so you see how cold/warm it is where you live. 
You can also change the city you want to see the temperature of without being logged in.

--------------------------------------------------------------------------------------------------------------------

INSTALLATION
------------

Required :

    - Node 
    - Mongo on your computer


Instructions to run :
- Run your mongo Database by typing
- Go in the folder where app.js is located and run :
    ```
        node app.js
    ```

- Enjoy 🎉



ORGANISATION:
------------

	WILLNAT Luis: 
	------------

	Admin Page
	Implementation of the Database (MongoDB), 
	Temperature update, 
	OpenWeather API (Weather from desired city) 

	WATIEZ Arno:
	-----------
	
	Get function (to get the weather),
	Website creation and design,
	Thermostat design,
	Sidebar
	
	FICKERT Pascal & GRUSCHKE Nico:
	--------------
	
	Change temp to Fahrenheit,
	Added humidity,
	Change city (OpenWeather API),
	Documentation
	Temperature log in a CSV file
	
	GIANGRECO Christian & KLEIN Alexis:
	----------------------------------
	
	Signup and login,
	Added possibility to save users to Database,
	Administrators (so you must be admin to change temp),
	German translation
