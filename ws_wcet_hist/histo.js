// A histogram library for showing the WCET
//
// author: stf

class histo{

        constructor(svg, colour, numBins, minBin, maxBin, x, y, name) {
                // hard coded parameters
                this.binWidth = 2;
                this.binSpace = 1;
                this.maxHeight = 250; // the maximum allowable height of the histogram

                this.colour = colour;

                this.svg = svg;
                this.numBins = numBins;
                this.minBin = minBin;
                this.maxBin = maxBin;
                this.x = x;
                this.y = y;
                this.name = name;

                // derived variables
                this.binSize = (maxBin - minBin)/numBins;

                // setup the bins
                this.bins = [ ];
                for(var i =0; i<this.numBins; i++) {
                        this.bins[i] = 0;
                }

                // for tracking the cumulative total in the bins
                this.total_samples = 0;
                this.cumulative_bins = [ ]

                this.clearDrawing(); // clear any currently drawn bins

                this.draw();
        }

        // Creates the cumulative totals bins
        cumulativeTotalBinCalc() {
                this.total_sample = 0;
                for(var i=0; i<this.numBins; i++) {
                        this.total_samples += this.bins[i];
                        this.cumulative_bins[i] = this.total_samples;
                }
        }

        // Get percentile bin -- returns the bin index for a given percentile with the
        // current data
        getPercentileBin(percentile) {
                var target_val = percentile*this.total_samples;
                console.log("Target Val = " + target_val);
                for(var i=0; i<this.numBins; i++) {
                        if(this.cumulative_bins[i] > target_val)
                                return i-1;
                }
        }

        // Gets the value at a bin index
        binVal(idx) {
                return this.minBin + idx*this.binSize;
        }

        // gets the x pos of a bin index
        binPos(idx) {
                return this.x + idx*(this.binWidth + this.binSpace);
        }

        // Draws a dashed line at the percentile point
        drawPercentile(percentile) {
                var idx = this.getPercentileBin(percentile);
                var label = (percentile*100) + "% = " + this.binVal(idx) + " ms";
                if(!Number.isNaN(this.binVal(idx)))
                        this.drawInfo(label, this.binPos(idx));
        }

        // Add an info line
        drawInfo(text, x) {
                // Draw the vertical line                
                this.svg.append("line")
                        .attr("id", this.name+"_histbin")
                        .attr("x1", x)
                        .attr("y1", this.y + this.maxHeight + 15)
                        .attr("x2", x)
                        .attr("y2", this.y)
                        .attr("stroke-width", 1)
                        .attr("stroke", this.colour.highlight)
                        .attr("stroke-dasharray", ("3,3"));

                this.svg.append("text")
                        .attr("id", this.name+"_histbin")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "12px")
                        .attr("fill", this.colour.highlight)
                        .attr("x", x - 10)
                        .attr("y", this.y + this.maxHeight + 30)
                        .text(text);
        }

        // Draws the histogram from the current data stored
        draw() {
                this.clearDrawing();
                this.cumulativeTotalBinCalc();

                // scale
                var maxv = this.maxVal();
                var hist_linear_scale = d3.scaleLinear().domain([0, maxv]).range([0,this.maxHeight]);

                for(var i=0; i < this.numBins; i++) {
                    var dbins = this.svg.append("rect")
                        .attr("id", this.name+"_histbin")
                        .attr("x", this.x + i*(this.binWidth + this.binSpace))
                        .attr("y", this.y + this.maxHeight - hist_linear_scale(this.bins[i]))
                        .attr("fill", this.colour.base)
                        .attr("width", this.binWidth)
                        .attr("height", hist_linear_scale(this.bins[i]));
                }

                // info lines on the histogram
                this.drawInfo(this.minBin + " ms", this.x);
                this.drawInfo(" >= "+this.maxBin + " ms", this.x + this.numBins*(this.binWidth + this.binSpace));

                // Percentiles
                this.drawPercentile(0.5);

        }

        // deletes all the histogram bins shown rendered on the display
        clearDrawing() { d3.selectAll("#"+this.name+"_histbin").remove(); }

        // clears all the data stored in this class
        clearData() { 
                for(var i=0; i<this.numBins; i++){
                        this.bins[i] = 0;
                }
        }

        // Max val -- returns the value in the largest bin
        maxVal() { 
                var max = 0;
                for(var i=0; i<this.numBins; i++) {
                        if(this.bins[i] > max)
                                max = this.bins[i];
                }
                return max;
        }

        addItem(item){
                // convert the item to a floating point number
                var val = parseFloat(item);

                // determine which bin it should be in and increment
                if(val > this.minBin) {
                    var shifted = val - this.minBin;
                    var divided = shifted / this.binSize;
                    var rounded = Math.floor(divided);
                    if(rounded >= this.numBins){
                        this.bins[this.numBins-1] = this.bins[this.numBins-1] + 1;
                    } else {
                        this.bins[rounded] = this.bins[rounded] + 1;
                    }
                } else {
                        this.bins[0] = this.bins[0] + 1;
                }
                
        }

}
