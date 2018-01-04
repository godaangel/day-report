CREATE DATABASE IF NOT EXISTS book_room DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

use book_room;
create table room_list
(
  id int auto_increment comment '会议室ID' primary key,
  name varchar(50) default '' not null comment '会议室名字',
  des varchar(255) default '' comment '会议室介绍',
  update_time varchar(255) comment '更新时间',
  create_time varchar(255) comment '创建时间'
)
comment '实验室会议室表';

create table record
(
  id int auto_increment comment '订单ID' primary key,
  related_id varchar(50) default '' not null comment '会议室ID',
  status tinyint(3) default '1' comment '状态: 确认使用(1) 取消(2)',
  des varchar(255) default '' comment '备注',
  users varchar(255) default '' comment '与会者名字',
  tel varchar(50) default '' not null comment '负责人电话',
  start_time varchar(255) comment '开始时间',
  end_time varchar(255) comment '开始时间',
  create_time varchar(255) comment '创建时间'
)
comment '预定订单';