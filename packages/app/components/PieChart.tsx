import React from 'react'
import { Svg, G, Path, Circle, Text as SvgText } from 'react-native-svg'
import { View } from 'react-native'
import { XStack, YStack, Paragraph, Circle as TamaguiCircle } from '@my/ui'

interface PieSlice {
    value: number;
    color: string;
    label: string;
}

interface PieChartProps {
    data: PieSlice[];
    size?: number;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
    const total = data.reduce((sum, slice) => sum + slice.value, 0);
    let startAngle = 0;
    const radius = size / 2;
    const center = size / 2;

    if (total === 0) {
        return (
            <YStack height={size} width={size} alignItems="center" justifyContent="center" backgroundColor="$backgroundPress" borderRadius={size} borderWidth={2} borderColor="$borderColor">
                <Paragraph color="$color10">No Data</Paragraph>
            </YStack>
        )
    }

    const slices = data.map((slice, index) => {
        const angle = (slice.value / total) * 360;
        const endAngle = startAngle + angle;

        // Create SVG path for slice
        const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
        const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
        ].join(' ');

        startAngle += angle;

        return <Path key={index} d={pathData} fill={slice.color} />;
    });

    return (
        <XStack alignItems="center" gap="$4" flexWrap="wrap" justifyContent="center">
            <View style={{ width: size, height: size }}>
                <Svg height={size} width={size}>
                    <G rotation="-90" origin={`${center}, ${center}`}>
                        {slices}
                    </G>
                    {/* Inner White Circle for Donut Effect */}
                    <Circle cx={center} cy={center} r={radius * 0.6} fill="white" />
                </Svg>
                <YStack
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Paragraph color="black" fontSize={24} fontWeight="800">${total}</Paragraph>
                </YStack>
            </View>

            {/* Legend */}
            <YStack gap="$2" minWidth={120}>
                {data.map((slice, index) => (
                    <XStack key={index} alignItems="center" gap="$2">
                        <TamaguiCircle size={10} backgroundColor={slice.color as any} />
                        <Paragraph size="$2" color="$color">{slice.label}</Paragraph>
                        <Paragraph size="$2" color="$color10" marginLeft="auto">{(slice.value / total * 100).toFixed(0)}%</Paragraph>
                    </XStack>
                ))}
            </YStack>
        </XStack>
    )
}
