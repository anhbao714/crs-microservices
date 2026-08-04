package vn.edu.crs.courseservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String tenMonHoc;
    private Integer soTinChi;
    private Integer soChoToiDa;
    private Integer soChoConLai;
}
