import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const MegaphoneIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M5 15.346c0 2.1 1.038 3.35 2.978 3.619l1.914 4.218c.49 1.088 1.173 1.62 2.194 1.62 1.324 0 2.277-.954 1.99-2.447l-.59-3.087a22.944 22.944 0 0 1 7.01 2.606c.303.911 1.122 1.502 2.193 1.502 1.358 0 2.311-.953 2.311-2.32V8.32C25 6.953 24.047 6 22.689 6c-1.097 0-1.932.624-2.219 1.577-2.606 1.544-5.938 2.556-8.595 2.843h-3.08C6.334 10.42 5 11.71 5 14.09v1.256Zm16.972 5.71V8.32c0-.422.287-.717.717-.717.421 0 .708.295.708.717v12.737c0 .422-.287.717-.708.717-.43 0-.717-.295-.717-.717Zm-9.836-3.6V11.98c2.961-.355 5.77-1.198 8.233-2.582v10.646c-2.514-1.417-5.297-2.236-8.233-2.59Zm-3.34-.043c-1.57 0-2.193-.59-2.193-2.067V14.09c0-1.476.624-2.066 2.193-2.066h1.738v5.39H8.796Zm2.598 5.323-1.755-3.72h2.185c.025 0 .06.008.093.008l.692 3.534c.092.448-.16.734-.54.734-.338 0-.498-.177-.675-.556Z"
      fill={fill}
    />
  </Icon>
);
