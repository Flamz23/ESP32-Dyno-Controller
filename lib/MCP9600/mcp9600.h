#ifndef mc9600_h
#define mc9600_h

// set up the MCP9600
void initializeMCP9600();

// get the temperature from the MCP9600
float getMCP9600Temperature();

// get the ambient temperature from the MCP9600
float getMCP9600AmbientTemperature();

#endif