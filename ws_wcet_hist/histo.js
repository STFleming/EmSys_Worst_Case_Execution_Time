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

                this.clearDrawing(); // clear any currently drawn bins

                this.draw();
        }

        draw() {
                this.clearDrawing();

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
