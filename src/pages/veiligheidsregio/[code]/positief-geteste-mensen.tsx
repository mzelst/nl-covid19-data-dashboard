import { useRouter } from 'next/router';
import useSWR from 'swr';
import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import siteText from 'locale';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { ResultsPerRegion, Regionaal } from 'types/data';
import replaceVariablesInText from 'utils/replaceVariablesInText';

const text: typeof siteText.veiligheidsregio_positief_geteste_personen =
  siteText.veiligheidsregio_positief_geteste_personen;

export function PostivelyTestedPeopleBarScale(props: {
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_increase_per_region}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout = () => {
  const router = useRouter();
  const { code } = router.query;
  const { data } = useSWR<Regionaal>(`/json/${code}.json`);

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={replaceVariablesInText(text.titel, {
          safetyRegion: 'Veiligheidsregionaam',
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            resultsPerRegion?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {resultsPerRegion && (
            <PostivelyTestedPeopleBarScale data={resultsPerRegion} />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {resultsPerRegion && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(
                  resultsPerRegion.last_value.hospital_total_counts_per_region
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>
        <p>{text.linechart_toelichting}</p>
        {resultsPerRegion && (
          <LineChart
            values={resultsPerRegion.values.map((value) => ({
              value: value.infected_increase_per_region,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export default PostivelyTestedPeople;