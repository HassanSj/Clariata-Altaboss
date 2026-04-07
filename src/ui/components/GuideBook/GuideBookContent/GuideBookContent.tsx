import React, {ReactElement} from "react";

const GuideBookContent = (): ReactElement => {

  return (
    <>
    <table className="table-page">
        <tr>
            <td>
                <div className="content-page">
                    <div className="content-row">
                        <div className="content-column-1">
                            <div className="blue contentpage-title">Contents</div>
                        </div>
                        <div>
                        <div className="content-section">
                            <div className="content-section-number orange">1</div>
                            <div>
                                <div className="content-section-title turquoise">Introduction</div>
                                <div className="content-section-subtitle">How to Use the LifeMap Guidebook</div>
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-number orange">2</div>
                            <div>
                                <div className="content-section-title turquoise">At A Glance</div>
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-number orange">3</div>
                            <div>
                                <div className="content-section-title turquoise">Discover: Our Life Journey</div>
                                <div className="content-section-subtitle">Vision/Mission/Core Value</div>
                                <div className="content-section-subtitle">The Story of Us</div>
                                <div className="content-section-subtitle">Personal Story</div>                                
                                <div className="content-section-subtitle">Family Story</div>
                                <div className="content-section-subtitle">Our Enterprise</div>
                                <div className="content-section-subtitle">Ancestral Timeline</div>
                                <div className="content-section-subtitle">Legacy of Five Family Tree</div>
                                <div className="content-section-subtitle">Legacy of Five Family Profile</div>
                                
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-number orange">4</div>
                            <div>
                                <div className="content-section-title turquoise">Dream: Our Vision for the Future</div>
                                <div className="content-section-subtitle">Priority Grid</div>
                                <div className="content-section-subtitle">The “Why” Report</div>
                                <div className="content-section-subtitle">Dimensions of Life Graph</div>
                                <div className="content-section-subtitle">Metrics of Success Graph</div>
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-number orange">5</div>
                            <div>
                                <div className="content-section-title turquoise">Direction: Our Plan for Success</div>
                                <div className="content-section-subtitle">Priority Ranking Report</div>
                                <div className="content-section-subtitle">Curation Summary</div>
                                <div className="content-section-subtitle">Action Plan Summary</div>
                                {/* <div className="content-section-subtitle">Gantt Chart Report</div> */}
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-number orange">6</div>
                            <div>
                                <div className="content-section-title turquoise">Final Thoughts</div>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                    
                </div>
            </td>
        </tr>
    </table>
      
    </>
  )
}


export default GuideBookContent;
