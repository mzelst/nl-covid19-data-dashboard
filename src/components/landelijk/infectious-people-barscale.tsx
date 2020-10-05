import { BarScale } from '~/components/barScale';
import { InfectiousPeopleCountNormalized } from '~/types/data.d';

import siteText from '~/locale/index';

const text = siteText.besmettelijke_personen;

export function InfectiousPeopleBarScale(props: {
  data: InfectiousPeopleCountNormalized | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={80}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infectious_avg_normalized}
      id="besmettelijk"
      rangeKey="infectious_normalized_high"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
      showAxis={showAxis}
    />
  );
}
