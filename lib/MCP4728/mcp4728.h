#ifndef mcp4728_h
#define mcp4728_h

// set up the MCP4728
void initializeMCP4728();

// set the value of a channel on the MCP4728
void setMCP4728(int channel, uint16_t value);

#endif