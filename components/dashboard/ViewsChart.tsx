import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AnimatedSection from '../AnimatedSection'


ChartJS.defaults.font = {
   family: "Segoe UI",
 };


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface ViewsChartProps {
  views: { created_at: string; id: string }[];
}

const ViewsChart = ({ views }: ViewsChartProps) => {

    if(views.length === 0)  {
        return null 
    }


  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Store views in the last week",
      },
    },
  };

  function prepData(arr: { created_at: string }[]) {
    interface Views {
      [any: string]: number;
    }
    let views: Views = {};

    arr.forEach((view) => {
      let date = view.created_at.split("T")[0];
      if (!views.hasOwnProperty(date)) {
        views[date] = 1;
      } else {
        views[date] = views[date] + 1;
      }
    });

    let labels = Object.keys(views);
    labels.sort((a: string, b: string) => {
      let aTimestamp = +new Date(a);
      let bTimestamp = +new Date(b);

      return bTimestamp - aTimestamp;
    });
    labels = labels.slice(0, 7);

    let data: number[] = [];
    labels.forEach((l) => {
      data.push(views[l]);
    });

    return {
      labels,
      datasetsData: data,
    };
  }

  const labels = prepData(views).labels;
  const datasetsData = prepData(views).datasetsData;
  const data = {
    labels,
    datasets: [
      {
        label: "views",
        data: datasetsData,
        backgroundColor: "#4299E1",
      },
    ],
  };

  return (
    <AnimatedSection>
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "15px",
        }}
      >
        <Bar options={options} data={data} />
      </div>
    </AnimatedSection>
  );
};

export default ViewsChart;
