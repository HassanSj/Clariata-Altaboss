import {ReactElement} from "react"
import {Household} from "~/types/api/household"
import {Objective, User} from "~/types/api/models"
import {Person} from "~/types/api/person"
import {getFamilyName, getFamilyPicture, getCouplePicture} from "../StoryOfUsReport/StoryOfUsReport"
import CurationSummaryTable from "./CurationSummaryTable"

export interface CurationSummaryProps {
    household?: Household;
    persons?: Person[];
    curationPriorities?: Objective[];
    isOpen?: boolean;
    owner?: User;
    onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export interface CurationSummaryPage {
    objectives: Objective[];
}

export const getCurationSummaryPages = async (curationPriorities?: Objective[]) => {

    const priorityPages: CurationSummaryPage[] = [];
    const curationSummaryPages = curationPriorities ? curationPriorities.length/10 : 0;
    for (let i = 0; i < curationSummaryPages; i++)
    {
        const begin = i * 10;
        const end = begin + 10;

        if(curationPriorities)
        {
            const priorities : CurationSummaryPage = {
                objectives: curationPriorities?.slice(begin, end)
            }

            priorityPages.push(priorities);        
        }
    };

    return priorityPages
}

const CurationSummary = ({
                                   household,
                                   persons,
                                   curationPriorities,
                                   isOpen,
                                   onClose
                               }: CurationSummaryProps): ReactElement => {
                               
    // const [priorityPages, setPriorityPages] = useState<Objective[][]>([]);
    const small: boolean = false;

    console.log(curationPriorities);

    const headerProps = {
        showHeader: true,
        title: "Curation Summary Report",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getCouplePicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: reportLogo
        };

    return (
        <>                    
                <CurationSummaryTable household={household} persons={persons} curationPriorities={curationPriorities} small={false}/>
            </>
 )
}

export default CurationSummary;
